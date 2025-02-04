const queueRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Queue = require('../models/queueModel')
const Admin = require('../models/adminModel')
const Desk = require('../models/deskModel')
const User = require('../models/userModel')
const QRCode = require('qrcode')
const { findWaitingCustomers, calculateAverageWaitingTime } = require('../utils/customerHelpers')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
queueRouter.post('/', async (request, response) => {
  const body = request.body

  const desk = await Desk.findOne({ desk_number: body.desk_number })
  if (!desk) {
    return response.status(400).json({ error: 'Desk not found' })
  }

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const admin = await Admin.findById(decodedToken.id)
  const user = await User.findById(desk.user)
  if (!user) {
    return response.status(400).json({ error: 'User not found' })
  }

  const expiration_date = new Date()
  expiration_date.setDate(expiration_date.getDate() + 1)

  const queue = new Queue({
    queue_name: body.queue_name,
    desk: desk.id,
    desk_number: desk.desk_number,
    max_of_customer: body.max_of_customer,
    createdBy: admin._id,
    status: body.status || 'Nonactive',
    user: user._id,
    expiration_date: expiration_date,
  })

  const BASE_URL = 'http://192.168.101.105:3001'
  const qrUrl = `${BASE_URL}/api/customers/auto-join/${queue._id.toString()}`

  try {
    const qrCode = await QRCode.toDataURL(qrUrl)
    queue.qr_code = qrCode
  } catch (error) {
    console.error('QR Code generation failed:', error)
    return response.status(500).json({ error: 'Failed to generate QR Code' })
  }

  const savedQueue = await queue.save()

  desk.queues.push(savedQueue._id)
  await desk.save()

  user.queues.push(savedQueue._id)
  await user.save()

  admin.queues = admin.queues.concat(savedQueue._id)
  await admin.save()

  response.json({
    ...savedQueue.toJSON(),
    qr_code: queue.qr_code,
  })
})

queueRouter.get('/', async (request, response) => {

  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  const queues = await Queue.find({})
    .populate('createdBy', 'username').populate('user','name') // populates fron ChatGPT
  response.json(queues)
})

queueRouter.get('/customerQueues/:id', async (request, response) => {
  const queues = await Desk.find({})
    .populate('queues')
    .populate('createdBy', 'username')
  response.json(queues)
})

queueRouter.get('/active', async (request, response) => { // updated from ChatGPT
  try {

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const active_queues = await Queue.find({ status: 'Active' })
      .populate('createdBy', 'username')

    const activeQueuesWithDetails = await Promise.all(active_queues.map(async (queue) => {
      const waitingCustomers = await findWaitingCustomers(queue._id)
      const averageWaitingTime = await calculateAverageWaitingTime(queue._id)

      return {
        ...queue.toObject(),
        waiting_customers: waitingCustomers.length,
        average_waiting_time: averageWaitingTime.averageWaitingTime,
      }
    }))
    response.json(activeQueuesWithDetails)

  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Error fetching active queues.' })
  }
})

queueRouter.get('/nonactive', async (request, response) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const nonactive_queues = await Queue.find({ status: 'nonactive' })
    .populate('createdBy', 'username')

  response.json(nonactive_queues)
})

queueRouter.get('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await Queue.findById(request.params.id).populate('createdBy', 'username')
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }

})

queueRouter.delete('/', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Queue.deleteMany({})
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

queueRouter.delete('/:id', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Queue.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

queueRouter.put('/:id', async (request, response, next) => {  // updated from ChatGPT
  const { queue_name, desk_number, max_of_customer, status } = request.body

  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const queue = await Queue.findById(request.params.id)
    const oldDeskNumber = queue.desk_number
    const oldUser = queue.user

    const oldDesk = await Desk.findOne({ desk_number: oldDeskNumber })
    if (oldDesk) {
      oldDesk.queues = oldDesk.queues.filter(q => q.toString() !== request.params.id)
      await oldDesk.save()
      console.log(`Queue removed from Desk ${oldDeskNumber}`)
    }

    if (oldUser) {
      const oldUserData = await User.findById(oldUser)
      if (oldUserData) {
        oldUserData.queues = oldUserData.queues.filter(q => q.toString() !== request.params.id)
        await oldUserData.save()
        console.log(`Queue removed from User ${oldUserData.name} queues`)

        if (oldUserData.status !== 'Busy') {
          oldUserData.status = 'Busy'
          await oldUserData.save()
          console.log(`User ${oldUserData.name} status updated to Busy`)
        }
      }
    }

    const desk = await Desk.findOne({ desk_number: desk_number })
    if (!desk) {
      return response.status(404).json({ error: 'Desk not found' })
    }


    const deskUser = desk.user
    if (!deskUser) {
      return response.status(400).json({ error: 'No user associated with this desk' })
    }

    desk.queues.push(queue._id)
    await desk.save()
    console.log(`Queue added to Desk ${desk_number}`)

    const userData = await User.findById(deskUser)
    if (userData) {
      userData.queues.push(queue._id)
      await userData.save()
      console.log(`Queue added to User ${userData.name} queues`)


      if (userData.status !== 'Busy') {
        userData.status = 'Busy'
        await userData.save()
        console.log(`User ${userData.name} status updated to Busy`)
      }
    }


    const updatedQueue = await Queue.findByIdAndUpdate(
      request.params.id,
      {
        queue_name,
        desk_number,
        max_of_customer,
        user: deskUser,
        status,
        desk_id: desk._id,
      },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedQueue) {
      return response.status(404).json({ error: 'Queue not found' })
    }

    console.log('Queue status updated successfully')

    if (status === 'Active') {
      const userData = await User.findById(updatedQueue.user)
      if (userData && userData.status !== 'Onwork') {
        userData.status = 'Onwork'
        await userData.save()
        console.log(`User ${userData.name} status updated to Onwork`)
      }
    }

    response.json(updatedQueue)
  } catch (error) {
    next(error)
  }
})


/* Qr routes */
queueRouter.get('/qr-code/:id', async (request, response) => { // updated from ChatGPT
  const queueId = request.params.id
  const url = `http://localhost:3001/api/customers?queue_id=${queueId}`

  try {
    const qrCode = await QRCode.toDataURL(url)
    response.json({ qr_code: qrCode })
  } catch {
    response.status(500).json({ error: 'Failed to generate QR Code' })
  }
})

queueRouter.post('/auto-join/:queue_id', async (request, response) => { //From ChatGPT
  const { queue_id } = request.params
  const customer_id = request.body.customer_id

  try {
    const queue = await Queue.findById(queue_id)
    if (!queue) {
      return response.status(404).json({ error: 'Queue not found' })
    }

    queue.customers.concat(customer_id)

    await queue.save()
    response.json({ message: 'Customer successfully added to the queue', queue })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Server error' })
  }
})

module.exports = queueRouter
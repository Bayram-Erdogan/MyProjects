const queueRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Queue = require('../models/queueModel')
//const Admin = require('../models/adminModel')
const Desk = require('../models/deskModel')
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

  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const admin = await Admin.findById(decodedToken.id)

  const queue = new Queue({
    queue_name: body.queue_name,
    desk: desk.id,
    desk_number: desk.desk_number,
    max_of_customer:body.max_of_customer,
    //createdBy: admin._id,
    status:body.status || 'Nonactive',
  })

  const qrUrl = `http://localhost:3001/api/customers/auto-join/${queue._id.toString()}`
  let qrCode

  try { //try-catch blog is from ChatGPT
    //qrCode = await QRCode.toDataURL(queue._id.toString())
    qrCode = await QRCode.toDataURL(qrUrl)
    queue.qr_code = qrCode
  } catch (error) {
    console.error('QR Code generation failed:', error)
    return response.status(500).json({ error: 'Failed to generate QR Code' })
  }

  const savedQueue = await queue.save()
  //admin.queues = admin.queues.concat(savedQueue._id)
  desk.queues.push(savedQueue._id)
  //await admin.save().then(console.log('Queue successfully created'))
  await desk.save()
  response.json({ //response is updated from ChatGPT
    ...savedQueue.toJSON(),
    qr_code: qrCode
  })
})

queueRouter.get('/', async (request, response) => {
  const queues = await Queue.find({})
    .populate('createdBy', 'username') // populates fron ChatGPT
  response.json(queues)
})

queueRouter.get('/active', async (request, response) => { // updated from ChatGPT
  try {
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

queueRouter.put('/:id', async (request, response, next) => {
  const { queue_name, desk_number, max_of_customer, status, user } = request.body

  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  Queue.findByIdAndUpdate(
    request.params.id,
    { queue_name, desk_number, max_of_customer, status, user },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedQueue => {
      response.json(updatedQueue)
      console.log('Your data has been updated successfully')
    })
    .catch(error => next(error))
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
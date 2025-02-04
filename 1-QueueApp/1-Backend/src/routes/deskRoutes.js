const deskRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Desk = require('../models/deskModel')
const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Queue = require('../models/queueModel')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

deskRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const admin = await Admin.findById(decodedToken.id)
  const user = body.userId ? await User.findById(body.userId) : null

  if (user && user.status !== 'Free') {
    return response.status(400).json({ error: 'User is not available' })
  }

  const desk = new Desk({
    desk_number: body.desk_number,
    createdBy: admin._id,
    user: user ? user._id : null
  })

  if (user) {
    user.status = 'Busy'
    await user.save()
  }

  const savedDesk = await desk.save()
  admin.desks = admin.desks.concat(savedDesk._id)
  await admin.save()

  console.log('Desk successfully created')
  response.json(savedDesk)
})

deskRouter.get('/', async (request, response) => {

  const desks = await Desk.find({})
    .populate('queues')
    .populate('createdBy', 'username')
  response.json(desks)
})

deskRouter.get('/customerDesks/:id', async (request, response) => {
  const user = await Desk.findById(request.params.id)
    .populate('createdBy', 'username')
    .populate('user', 'name email status')
    .populate('queues', 'queue_name total_customer waiting_customer active_customer')
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

deskRouter.get('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await Desk.findById(request.params.id)
    .populate('createdBy', 'username')
    .populate('user', 'name email status')
    .populate('queues', 'queue_name total_customer waiting_customer active_customer')
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

deskRouter.delete('/', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Desk.deleteMany({})
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

deskRouter.delete('/:id', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Desk.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
      console.log('Desk successfully deleted')
    })
    .catch(error => next(error))

})

deskRouter.put('/:id', async (request, response, next) => {
  const { desk_number, status, userId } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  try {
    const existingDesk = await Desk.findById(request.params.id)
    if (!existingDesk) {
      return response.status(404).json({ error: 'Desk not found' })
    }

    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        { status: 'Busy' },
        { new: true }
      )
    }

    let updatedDesk = await Desk.findByIdAndUpdate(
      request.params.id,
      {
        desk_number: desk_number || existingDesk.desk_number,
        status: status || existingDesk.status,
        user: userId || existingDesk.user,
      },
      { new: true, runValidators: true, context: 'query' }
    )

    if (userId) {
      const queue = await Queue.findOne({ desk: existingDesk._id })

      if (queue) {
        await Queue.findByIdAndUpdate(
          queue._id,
          { user: userId },
          { new: true }
        )
      }
    }

    if (status === 'Active' && userId) {
      await User.findByIdAndUpdate(
        userId,
        { status: 'Onwork' },
        { new: true }
      )
    }

    if (status === 'Nonactive') {
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          { status: 'Free' },
          { new: true }
        )
      }

      updatedDesk = await Desk.findByIdAndUpdate(
        request.params.id,
        { user: null },
        { new: true }
      )

      const queue = await Queue.findOne({ desk: existingDesk._id })
      if (queue) {
        await Queue.findByIdAndUpdate(
          queue._id,
          { user: null },
          { new: true }
        )
      }
    }

    response.json(updatedDesk)
  } catch (error) {
    next(error)
  }
})


module.exports = deskRouter
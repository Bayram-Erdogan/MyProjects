const queueRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Queue = require('../models/queueModel')
const Admin = require('../models/adminModel')
const Desk = require('../models/deskModel')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

queueRouter.post('/', async (request, response) => {
  const body = request.body
  const desk = await Desk.findById(body.desk_id)
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const admin = await Admin.findById(decodedToken.id)

  const queue = new Queue({
    queue_name: body.queue_name,
    desk: desk.id,
    max_of_customer:body.max_of_customer,
    createdBy: admin._id
  })

  const savedQueue = await queue.save()
  admin.desks = admin.desks.concat(savedQueue._id)
  await admin.save().then(console.log('Queue successfully created'))

  response.json(savedQueue)
})

queueRouter.get('/', async (request, response) => {
  const queues = await Queue.find({}).populate('desk', 'desk_number').populate('createdBy', 'username') //  Populate from ChatGPT
  response.json(queues)
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
  const { queue_name, desk_number, max_of_customer } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Queue.findByIdAndUpdate(
    request.params.id,
    { queue_name, desk_number, max_of_customer },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedQueue => {
      response.json(updatedQueue)
    })
    .catch(error => next(error))
})

module.exports = queueRouter
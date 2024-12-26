const deskRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Desk = require('../models/deskModel')
const Admin = require('../models/adminModel')

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

  const desk = new Desk({
    desk_number: body.desk_number,
    createdBy: admin._id
  })

  const savedDesk = await desk.save()
  admin.desks = admin.desks.concat(savedDesk._id)
  await admin.save().then(console.log('Desk successfully created'))

  response.json(savedDesk)
})

deskRouter.get('/', async (request, response) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const desks = await Desk.find({})
    .populate('queues')
    .populate('createdBy', 'username')
  response.json(desks)
})

deskRouter.get('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await Desk.findById(request.params.id).populate('createdBy', 'username')
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
  const {  desk_number } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Desk.findByIdAndUpdate(
    request.params.id,
    {  desk_number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedQueue => {
      response.json(updatedQueue)
    })
    .catch(error => next(error))
})

module.exports = deskRouter
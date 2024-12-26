const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

userRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const admin = await Admin.findById(decodedToken.id)

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    name: body.name,
    email: body.email,
    passwordHash,
    createdBy: admin._id
  })

  const savedUser = await user.save()
  admin.users = admin.users.concat(savedUser._id)
  await admin.save().then(console.log('User successfully created'))

  response.json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const users = await User.find({}).populate('createdBy', 'username') //  Populate from ChatGPT
  response.json(users)
})

userRouter.get('/:id', async (request, response) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(request.params.id).populate('createdBy', 'username')
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }

})

userRouter.delete('/', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  User.deleteMany({})
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

userRouter.delete('/:id', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  User.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

userRouter.put('/:id', async (request, response, next) => {
  const { name, email, password, desk, queue } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  User.findByIdAndUpdate(
    request.params.id,
    { name, email, password, desk, queue },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedUser => {
      response.json(updatedUser)
    })
    .catch(error => next(error))
})

module.exports = userRouter
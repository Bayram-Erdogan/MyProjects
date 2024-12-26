const bcrypt = require('bcrypt')
const adminRouter = require('express').Router()
const Admin = require('../models/adminModel')

adminRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const admin = new Admin({
    username,
    passwordHash,
  })

  const savedAdmin = await admin.save().then(console.log('Admin successfully created'))

  response.status(201).json(savedAdmin)
})

adminRouter.get('/', async (request, response) => {
  const admins = await Admin.find({})
    .populate('users', 'name')
    .populate('desks', 'desk_number')
    .populate('queues','queue_name desk_number status total_customer waiting_customer active_customer')
    .populate('customers', 'queue_id')
  response.json(admins)
})

adminRouter.get('/:id', async (request, response) => {

  const admin = await Admin.findById(request.params.id).populate('users', 'name')
  if (admin) {
    response.json(admin)
  } else {
    response.status(404).end()
  }
})

adminRouter.delete('/', (request, response, next) => {
  Admin.deleteMany({})
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

adminRouter.delete('/:id', (request, response, next) => {
  Admin.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

adminRouter.put('/:id', (request, response, next) => {
  const { username, password } = request.body

  Admin.findByIdAndUpdate(
    request.params.id,
    { username, password },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedAdmin => {
      response.json(updatedAdmin)
    })
    .catch(error => next(error))
})

module.exports = adminRouter
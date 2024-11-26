const staffRouter = require('express').Router()
const Staff = require('../models/staffModel')
const Admin = require('../models/adminModel')

staffRouter.post('/', async (request, response) => {
  const body = request.body

  const admin = await Admin.findById(body.id)

  const staff = new Staff({
    username: body.username,
    password: body.password ,
    createdBy: admin.id
  })

  const savedStaff = await staff.save()
  admin.staffs = admin.staffs.concat(savedStaff._id)
  await admin.save()

  response.status(201).json(savedStaff)
})

staffRouter.get('/', async (request, response) => {
  const staffs = await Staff.find({}).populate('createdBy', 'username') //  Populate from ChatGPT
  response.json(staffs)
})


staffRouter.get('/:id', async (request, response) => {

  const staff = await Staff.findById(request.params.id).populate('createdBy', 'username')
  if (staff) {
    response.json(staff)
  } else {
    response.status(404).end()
  }

})


staffRouter.delete('/', (request, response, next) => {
  Staff.deleteMany({})
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

staffRouter.delete('/:id', (request, response, next) => {
  Staff.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

staffRouter.put('/:id', (request, response, next) => {
  const { username, password } = request.body

  Staff.findByIdAndUpdate(
    request.params.id,
    { username, password },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedStaff => {
      response.json(updatedStaff)
    })
    .catch(error => next(error))
})

module.exports = staffRouter
const customerRouter = require('express').Router()
const Queue = require('../models/queueModel')
const Customer = require('../models/customerModel')
const Admin = require('../models/adminModel')

customerRouter.post('/', async (request, response) => {
  const queue = await Queue.findOne({ _id: request.body.queue_id })

  const customer = new Customer({
    queue_id: queue,
  })

  const admin = await Admin.findById(queue.createdBy)

  const savedCustomer = await customer.save()

  admin.customers = admin.customers.concat(savedCustomer._id)
  await admin.save().then(console.log('Customer successfully created'))

  queue.waiting_customer +=1
  queue.total_customer +=1
  queue.save()
  response.json(savedCustomer)
})

customerRouter.get('/', async (request, response) => {
  const customers = await Customer.find({})
    .populate( 'queue_id' , 'queue_name desk_number' )

  response.json(customers)
  console.log(`Total number of customers : ${customers.length}`)
})

customerRouter.post('/joinQueue', async (request, response) => {
  const { queue_id } = request.body

  const queue = await Queue.findById(queue_id)

  const customer = new Customer({
    queue_id: queue._id,
  })

  const savedCustomer = await customer.save()

  queue.waiting_customer += 1
  queue.total_customer += 1
  await queue.save()

  response.json(savedCustomer)

})


customerRouter.get('/auto-join/:queue_id', async (request, response) => { // From ChatGPT
  const { queue_id } = request.params

  const queue = await Queue.findById(queue_id)
  const customer = new Customer({ queue_id: queue._id })

  await customer.save()

  queue.waiting_customer += 1
  queue.total_customer += 1
  await queue.save()

  response.send(`
      <h1>You have successfully joined the queue!</h1>
      <p>Queue ID: ${queue_id}</p>
  `)
})


module.exports = customerRouter
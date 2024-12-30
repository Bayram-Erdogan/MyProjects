const customerRouter = require('express').Router()
const Queue = require('../models/queueModel')
const Customer = require('../models/customerModel')
const { calculateAverageWaitingTime } = require('../utils/customerHelpers')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

customerRouter.post('/joinQueue', async (request, response) => {
  try {
    const { queue_id } = request.body

    const queue = await Queue.findById(queue_id)

    const customer = new Customer({ queue_id: queue._id })
    const savedCustomer = await customer.save()

    queue.waiting_customer += 1
    queue.total_customer += 1

    if (queue.waiting_customer >= queue.max_of_customer) {
      queue.status = 'Nonactive'
    }

    await queue.save()

    response.status(201).json(savedCustomer)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

customerRouter.get('/', async (request, response) => {
  const customers = await Customer.find({})
    .populate( 'queue_id' , 'queue_name desk_number' )

  response.json(customers)
  console.log(`Total number of customers : ${customers.length}`)
})

customerRouter.get('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const customer = await Customer.findById(request.params.id)
  if (customer) {
    response.json(customer)
  } else {
    response.status(404).end()
  }

})

customerRouter.put('/:id', async (request, response, next) => {
  const { status } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Customer.findByIdAndUpdate(
    request.params.id,
    { status },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedCustomer => {
      response.json(updatedCustomer)
    })
    .catch(error => next(error))
})


/****** */


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

customerRouter.get('/waiting/:queue_id', async (request, response) => {
  const { queue_id } = request.params

  const totalOfWaitingCustomers = await Customer.countDocuments({
    queue_id,
    status: 'waiting',
  })

  response.json({
    queue_id,
    waiting_customers: totalOfWaitingCustomers,
  })
})


customerRouter.get('/average-waiting-time/:queue_id', async (request, response) => { // From ChatGPT
  const { queue_id } = request.params
  const result = await calculateAverageWaitingTime(queue_id)
  response.status(200).json(result)

})


module.exports = customerRouter
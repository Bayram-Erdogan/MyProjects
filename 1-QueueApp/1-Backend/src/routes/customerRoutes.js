const customerRouter = require('express').Router()
const Queue = require('../models/queueModel')
const Customer = require('../models/customerModel')
const { calculateAverageWaitingTime, calculateCustomerPosition,calculateEstimatedWaitTime } = require('../utils/customerHelpers')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


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

    if (queue.status === 'Nonactive') {
      queue.status = 'Active'
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

customerRouter.put('/:id', async (request, response) => { // Updated From ChatGPT
  const { status } = request.body
  const customerId = request.params.id

  try {
    const customer = await Customer.findById(customerId)

    if (!customer) {
      return response.status(404).json({ error: 'Customer not found' })
    }

    let updateFields = {}
    if (customer.status === 'waiting' && status === 'process') {
      updateFields.process_start_time = new Date()
      updateFields.status = 'process'

      if (customer.queue_id) {
        try {
          const queueId = new mongoose.Types.ObjectId(customer.queue_id)
          const queue = await Queue.findById(queueId)
          console.log(queue.waiting_customer)
          if (queue) {
            queue.waiting_customer = Math.max(0, queue.waiting_customer - 1)
            console.log(queue.waiting_customer)
            if (queue.status === 'Nonactive' && queue.waiting_customer < queue.max_of_customer) {
              queue.status = 'Active'
            }
            await queue.save()
          } else {
            console.log('Queue not found for the attached_queue ID.')
          }
        } catch (err) {
          console.error('Error in finding or updating queue:', err)
        }
      } else {
        console.log('No queue_id for customer.')
      }
    } else if (customer.status === 'process' && status === 'done') {
      updateFields.done_time = new Date()
      updateFields.status = 'done'

      if (customer.queue_id) {
        try {
          const queueId = new mongoose.Types.ObjectId(customer.queue_id)
          const queue = await Queue.findById(queueId)

          if (queue) {
            queue.waiting_customer = Math.max(0, queue.waiting_customer)
            if (queue.status === 'Nonactive' && queue.waiting_customer < queue.max_of_customer) {
              queue.status = 'Active'
            }
            await queue.save()
          } else {
            console.log('Queue not found for the attached_queue ID.')
          }
        } catch (err) {
          console.error('Error in updating queue for done status:', err)
        }
      }
    } else if (customer.status === 'waiting' && status === 'done') {
      return
    } else {
      console.error(`Geçersiz durum geçişi: ${customer.status} -> ${status}`)
      return
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateFields, { new: true })
    response.json(updatedCustomer)

  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Something went wrong' })
  }
})

/****** */
customerRouter.get('/auto-join/:queue_id', async (request, response) => {
  const { queue_id } = request.params

  try {
    const queue = await Queue.findById(queue_id)
    if (!queue) {
      return response.status(404).send('<h1>Queue not found</h1>')
    }

    const deskNumber= queue.desk_number
    const customer = new Customer({
      queue_id: queue._id,
      status: 'waiting',
      joining_time: {
        date: new Date().toISOString().slice(0, 10),
        hour: new Date().toISOString().slice(11, 16)
      }
    })

    if (queue.waiting_customer >= queue.max_of_customer) {
      queue.status = 'Nonactive'
      await queue.save()
      return response.send('<h1>The queue is full and no longer active.</h1>')
    }

    if (queue.waiting_customer < queue.max_of_customer && queue.status === 'Nonactive') {
      queue.status = 'Active'
      await queue.save()
    }

    await customer.save()
    queue.waiting_customer += 1
    queue.total_customer += 1
    await queue.save()

    const position = await calculateCustomerPosition(queue_id)


    const estimatedWaitTime = await calculateEstimatedWaitTime(queue_id, position)

    response.send(`
      <html>
        <head>
          <script type="text/javascript">
            window.onload = function() {
              // Kullanıcıya alert gösterme
              alert('You have successfully joined the queue!\\nYour position in the queue: ${position}\\nEstimated wait time: ${estimatedWaitTime} minutes');
            }
          </script>
        </head>
        <body>
          <h1>You have successfully joined the queue!</h1>
          <p>Your position in the queue: ${position}</p>
          <p>Desk Number: ${deskNumber}</p>
          <p>Estimated wait time: ${estimatedWaitTime} minutes</p>
          <p>Number of customers currently waiting: ${position -1}</p>
        </body>
      </html>
    `)
  } catch (error) {
    console.error('Error joining the queue:', error.message)
    console.error(error.stack)
    response.status(500).send('<h1>An error occurred while joining the queue.</h1>')
  }
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

customerRouter.get('/average-waiting-time/:queue_id', async (request, response) => { //Updated From ChatGPT
  const { queue_id } = request.params

  try {
    const averageWaitingTime = await calculateAverageWaitingTime(queue_id)
    response.status(200).json({ queue_id, average_waiting_time: averageWaitingTime })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})


module.exports = customerRouter
const customerRouter = require('express').Router()
const Queue = require('../models/queueModel')
const Customer = require('../models/customerModel')
const { calculateAverageWaitingTime, calculateEstimatedWaitTime } = require('../utils/customerHelpers')
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

customerRouter.put('/:id', async (request, response) => {
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

      const customers = await Customer.find({})

      await Promise.all(customers.map(async (customer) => {
        customer.waiting_before_me = Math.max(0, customer.waiting_before_me - 1)
        await customer.save()
      }))

      if (customer.queue_id) {
        try {
          const queueId = new mongoose.Types.ObjectId(customer.queue_id)
          const queue = await Queue.findById(queueId)

          if (queue) {
            queue.waiting_customer = Math.max(0, queue.waiting_customer - 1)

            if (queue.waiting_customer === 0) {
              queue.status = 'Nonactive'
            } else if (queue.waiting_customer < queue.max_of_customer) {
              queue.status = 'Active'
            }
            await queue.save()
          } else {
            console.log('Queue not found for the attached_queue ID')
          }
        } catch (err) {
          console.error('Error in finding or updating queue:', err)
        }
      } else {
        console.log('No queue_id for customer')
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

            if (queue.waiting_customer === 0) {
              queue.status = 'Nonactive'
            } else if (queue.waiting_customer < queue.max_of_customer) {
              queue.status = 'Active'
            }

            const nextCustomer = await Customer.findOne({
              queue_id: customer.queue_id,
              status: 'waiting',
            }).sort({ waiting_before_me: 1 })

            if (nextCustomer) {
              nextCustomer.status = 'process'
              nextCustomer.process_start_time = new Date()

              queue.waiting_customer = Math.max(0, queue.waiting_customer - 1)

              const customers = await Customer.find({ queue_id: customer.queue_id, status: 'waiting' })

              await Promise.all(
                customers.map(async (customer) => {
                  customer.waiting_before_me = Math.max(0, customer.waiting_before_me - 1)
                  await customer.save()
                })
              )

              await nextCustomer.save()
            }

            await queue.save()
          } else {
            console.log('Queue not found for the attached_queue ID')
          }
        } catch (err) {
          console.error('Error in updating queue for done status:', err)
        }
      }
    } else if (customer.status === 'waiting' && status === 'abandoned') {
      updateFields.status = 'abandoned'
      const customers = await Customer.find({})

      await Promise.all(customers.map(async (customer) => {
        customer.waiting_before_me = Math.max(0, customer.waiting_before_me - 1)
        await customer.save()
      }))

      if (customer.queue_id) {
        try {
          const queueId = new mongoose.Types.ObjectId(customer.queue_id)
          const queue = await Queue.findById(queueId)

          if (queue) {
            queue.waiting_customer = Math.max(0, queue.waiting_customer - 1)

            if (queue.waiting_customer === 0) {
              queue.status = 'Nonactive'
            } else if (queue.waiting_customer < queue.max_of_customer) {
              queue.status = 'Active'
            }
            await queue.save()
          } else {
            console.log('Queue not found for the attached_queue ID')
          }
        } catch (err) {
          console.error('Error in finding or updating queue:', err)
        }
      }
    } else {
      console.error(`Invalid status transition: ${customer.status} -> ${status}`)
      return response.status(400).json({ error: 'Invalid status transition' })
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateFields, { new: true })
    response.json(updatedCustomer)

  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Something went wrong' })
  }
})


/*******/

customerRouter.get('/auto-join/:queue_id', async (request, response) => {
  const { queue_id } = request.params

  try {
    const isServerDown = false

    if (isServerDown) {
      return response.status(503).send('<h1>Service temporarily unavailable. Please try again later.</h1>')
    }

    const queue = await Queue.findById(queue_id)
    if (!queue) {
      return response.status(400).send('<h1>Invalid or expired QR code</h1>')
    }

    const now = new Date()
    if (queue.expiration_date && new Date(queue.expiration_date) < now) {
      queue.status = 'Invalid'
      await queue.save()
      return response.status(400).send('<h1>Expired QR code</h1>')
    }

    const deskNumber = queue.desk_number
    const customersInQueue = await Customer.countDocuments({ queue_id: queue_id, status: 'waiting' })
    const customer = new Customer({
      queue_id: queue._id,
      status: 'waiting',
      waiting_before_me: customersInQueue,
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

    const position = customersInQueue + 1
    const estimatedWaitTime = await calculateEstimatedWaitTime(queue_id, position)

    response.send(`
      <html>
        <head>
          <script type="text/javascript">
            window.onload = function() {
              const modal = document.createElement('div')
              modal.style.position = 'fixed'
              modal.style.top = '0'
              modal.style.left = '0'
              modal.style.width = '100%'
              modal.style.height = '100%'
              modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
              modal.style.display = 'flex'
              modal.style.justifyContent = 'center'
              modal.style.alignItems = 'center'
              modal.innerHTML = \`
                <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                  <h2>You have successfully joined the queue!</h2>
                  <p>Your position in the queue: ${position}</p>
                  <p>Desk Number: ${deskNumber}</p>
                  <p>Estimated wait time: ${estimatedWaitTime} minutes</p>
                  <p>Number of customers currently waiting: ${position - 1}</p>
                  <p>Your Customer ID: ${customer._id}</p>
                  <a href="/" target="_blank" style="text-decoration: none; color: blue; font-weight: bold;">Click here for more information</a>
                  <br><br>
                  <button onclick="document.body.removeChild(modal)">Close</button>
                </div>
              \`
              document.body.appendChild(modal)
            }
          </script>
        </head>
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
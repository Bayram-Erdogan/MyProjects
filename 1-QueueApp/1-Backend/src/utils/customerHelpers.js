const { DateTime } = require('luxon')
const Customer = require('../models/customerModel')

const findWaitingCustomers = async (queue_id) => {
  try {
    return await Customer.find({
      queue_id: queue_id,
      status: 'waiting',
    })
  } catch (error) {
    console.error('Error finding waiting customers:', error)
    throw new Error('Error finding waiting customers')
  }
}

const calculateAverageWaitingTime = async (queue_id) => {
  try {
    const waitingCustomers = await findWaitingCustomers(queue_id)

    if (waitingCustomers.length === 0) {
      return { averageWaitingTime: 0, message: 'No waiting customers in this queue.' }
    }

    const now = DateTime.local()

    const totalWaitingTime = waitingCustomers.reduce((total, customer) => {
      const customerJoiningTime = `${customer.joining_time.date}T${customer.joining_time.hour}:00`

      const joiningDate = DateTime.fromISO(customerJoiningTime, { zone: 'UTC' })

      const waitingTimeInMinutes = now.diff(joiningDate, 'minutes').minutes

      return total + waitingTimeInMinutes
    }, 0)

    const averageWaitingTime = totalWaitingTime / waitingCustomers.length

    return { averageWaitingTime: averageWaitingTime.toFixed(2), unit: 'minutes' }
  } catch (error) {
    console.error('Error calculating average waiting time:', error)
    throw new Error('Error calculating average waiting time')
  }
}

module.exports = {
  findWaitingCustomers,
  calculateAverageWaitingTime,
}

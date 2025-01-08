// All functions from ChatGPT
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

// Tek bir müşterinin bekleme süresini hesaplar.
const calculateCustomerWaitingTime = (customer) => {
  try {
    const customerJoiningTime = `${customer.joining_time.date}T${customer.joining_time.hour}:00`
    const joiningDate = DateTime.fromISO(customerJoiningTime, { zone: 'UTC' })
    const now = DateTime.local()

    const waitingTimeInMinutes = now.diff(joiningDate, 'minutes').minutes

    return waitingTimeInMinutes
  } catch (error) {
    console.error('Error calculating customer waiting time:', error)
    throw new Error('Error calculating customer waiting time')
  }
}

//Belirli bir kuyruğun ortalama bekleme süresini hesaplar.
const calculateAverageWaitingTime = async (queue_id) => {
  try {
    const waitingCustomers = await findWaitingCustomers(queue_id)

    if (waitingCustomers.length === 0) {
      return { averageWaitingTime: 0, message: 'No waiting customers in this queue.' }
    }

    const totalWaitingTime = waitingCustomers.reduce((total, customer) => {
      const waitingTimeInMinutes = calculateCustomerWaitingTime(customer)
      return total + waitingTimeInMinutes
    }, 0)

    const averageWaitingTime = totalWaitingTime / waitingCustomers.length

    return { averageWaitingTime: averageWaitingTime.toFixed(2), unit: 'minutes' }
  } catch (error) {
    console.error('Error calculating average waiting time:', error)
    throw new Error('Error calculating average waiting time')
  }
}

//Tek bir müşterinin işlem tamamlanana kadar geçen toplam bekleme süresini hesaplar.
const calculateTotalWaitingTimeForCustomer = (customer) => {
  if (!customer.done_time) {
    return null
  }

  const customerJoiningTime = `${customer.joining_time.date}T${customer.joining_time.hour}:00`
  const joiningDate = DateTime.fromISO(customerJoiningTime, { zone: 'UTC' })
  const doneDate = DateTime.fromISO(customer.done_time, { zone: 'UTC' })

  const totalWaitingTime = doneDate.diff(joiningDate, 'minutes').minutes

  return totalWaitingTime
}

//Belirli bir kuyruğun tamamlanan işlemleri için ortalama toplam bekleme süresini hesaplar.
const calculateAverageTotalWaitingTime = async (queue_id) => {
  try {
    const completedCustomers = await Customer.find({ queue_id, done_time: { $ne: null } })

    if (completedCustomers.length === 0) {
      return { averageTotalWaitingTime: 0, message: 'No completed customers in this queue.' }
    }

    const totalWaitingTime = completedCustomers.reduce((total, customer) => {
      const totalWaitingTimeForCustomer = calculateTotalWaitingTimeForCustomer(customer)
      return total + totalWaitingTimeForCustomer
    }, 0)

    const averageTotalWaitingTime = totalWaitingTime / completedCustomers.length

    return { averageTotalWaitingTime: averageTotalWaitingTime.toFixed(2), unit: 'minutes' }
  } catch (error) {
    console.error('Error calculating average total waiting time:', error)
    throw new Error('Error calculating average total waiting time')
  }
}

module.exports = {
  findWaitingCustomers,
  calculateCustomerWaitingTime,
  calculateAverageWaitingTime,
  calculateTotalWaitingTimeForCustomer,
  calculateAverageTotalWaitingTime,
}

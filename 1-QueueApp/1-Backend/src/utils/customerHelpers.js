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
    console.error('Error finding waiting customers for queue:', queue_id, error.message)
    console.error(error.stack)
    throw new Error('Error finding waiting customers')
  }
}

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

const calculateCustomerPosition = async (queue_id) => {
  try {
    // Kuyruğun mevcut bekleyen müşteri sayısını alıyoruz
    const waitingCustomers = await Customer.find({
      queue_id: queue_id,
      status: 'waiting',
    })

    // Yeni pozisyon, mevcut bekleyen müşteri sayısının bir fazlasıdır
    const position = waitingCustomers.length

    return position
  } catch (error) {
    console.error('Error calculating position for queue:', queue_id, error.message)
    console.error(error.stack)
    throw new Error('Could not calculate position.')
  }
}

const calculateAverageProcessingTime = async (queue_id) => {
  try {
    // Tamamlanan müşterileri alın
    const completedCustomers = await Customer.find({
      queue_id,
      done_time: { $ne: null } // Sadece 'done_time' değeri olanları al
    })

    if (completedCustomers.length === 0) {
      // Eğer tamamlanan müşteri yoksa, varsayılan bir değer döndür
      console.log('No completed customers found. Returning default processing time.')
      return 5 // Varsayılan işlem süresi 5 dakika
    }

    const totalProcessingTime = completedCustomers.reduce((total, customer) => {
      // Eğer 'done_time' mevcutsa işleme devam et
      if (customer.done_time && customer.process_start_time) {
        const processStartTime = DateTime.fromISO(customer.process_start_time.toISOString(), { zone: 'UTC' })
        const doneTime = DateTime.fromISO(customer.done_time.toISOString(), { zone: 'UTC' })
        const processingTime = doneTime.diff(processStartTime, 'minutes').minutes
        return total + processingTime
      }
      return total // 'done_time' veya 'process_start_time' yoksa işlem yapma
    }, 0)

    // Ortalama işlem süresini döndür
    return parseFloat((totalProcessingTime / completedCustomers.length).toFixed(2))
  } catch (error) {
    console.error('Error calculating average processing time:', error.message)
    console.error(error.stack)
    throw new Error('Error calculating average processing time')
  }
}

const calculateEstimatedWaitTime = async (queue_id, position) => {
  try {
    // Kuyruğun ortalama işlem süresi alınır
    const averageProcessingTime = await calculateAverageProcessingTime(queue_id)

    // Eğer ortalama işlem süresi bulunmazsa, varsayılan bir değer döndür
    const processingTime = averageProcessingTime || 5

    // Pozisyon-1, kuyruğun başındaki bekleyenleri ifade eder
    return (position - 1) * processingTime
  } catch (error) {
    console.error('Error calculating estimated wait time for queue:', queue_id, error.message)
    console.error(error.stack)
    throw new Error('Error calculating estimated wait time')
  }
}

module.exports = {
  findWaitingCustomers,
  calculateCustomerWaitingTime,
  calculateAverageWaitingTime,
  calculateTotalWaitingTimeForCustomer,
  calculateAverageTotalWaitingTime,
  calculateCustomerPosition,
  calculateAverageProcessingTime,
  calculateEstimatedWaitTime
}

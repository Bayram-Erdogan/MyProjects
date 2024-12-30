const mongoose = require('mongoose')

const statisticsSchema = new mongoose.Schema({
  queue_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
  average_time_of_waiting: {
    type: Number,
    default: 0,
  },
  total_customer:{
    type: Number,
    default :0
  },
})

statisticsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    const orderedObject = {
      statistics_id: returnedObject.id,
      atteched_queue: returnedObject.queue_name
    }
    return orderedObject
  }
})

module.exports = mongoose.model('Statistic', statisticsSchema)

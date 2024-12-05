const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  queue_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  joining_time : {
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    hour: {
      type: String,
      default: () => new Date().toISOString().slice(11, 16),
    },
  },
  status : {
    type: String,
    enum: ['waiting', 'process', 'done'],
    default: 'waiting',
  }
})

customerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    const orderedObject = {
      customer_id: returnedObject.id,
      attached_queue: returnedObject.queue_id,
      joining_time: returnedObject.joining_time,
      status:returnedObject.status
    }

    return orderedObject

  }
})

module.exports = mongoose.model('Customer', customerSchema)
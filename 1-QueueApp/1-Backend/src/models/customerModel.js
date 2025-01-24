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
  process_start_time: { type: Date },
  done_time: { type: Date },
  status : {
    type: String,
    enum: ['waiting', 'process', 'done', 'abandoned'],
    default: 'waiting',
  },
  waiting_before_me: {
    type: Number,
    default: 0,
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
      status:returnedObject.status,
      process_start_time: returnedObject.process_start_time,
      done_time: returnedObject.done_time,
      waiting_before_me: returnedObject.waiting_before_me,
    }

    return orderedObject

  }
})

module.exports = mongoose.model('Customer', customerSchema)
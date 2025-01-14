const mongoose = require('mongoose')

const queueSchema = new mongoose.Schema({
  queue_name: {
    type: String,
    required: true,
    minLength: 3,
  },
  desk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Desk',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  max_of_customer: Number,
  active_customer:{
    type: Number,
    default :0
  },
  waiting_customer:{
    type: Number,
    default :0
  },
  total_customer:{
    type: Number,
    default :0
  },
  desk_number : {
    type : Number,
    required: true
  },
  createdTime: {
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    hour: {
      type: String,
      default: () => new Date().toISOString().slice(11, 16),
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  status: {
    type: String,
    enum: ['Active', 'Nonactive'],
    default: 'Nonactive',
  },
  qr_code: {
    type: String,
  }
})

queueSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    const orderedObject = {
      queue_name: returnedObject.queue_name,
      attached_desk: returnedObject.desk_number,
      max_of_customer:returnedObject.max_of_customer,
      queue_id: returnedObject.id,
      createdTime: returnedObject.createdTime,
      createdBy:returnedObject.createdBy,
      status: returnedObject.status,
      active_customer:returnedObject.active_customer,
      waiting_customer:returnedObject.waiting_customer,
      total_customer:returnedObject.total_customer,
      qr_code: returnedObject.qr_code,
      user: returnedObject.user
    }
    return orderedObject

  }
})

module.exports = mongoose.model('Queue', queueSchema)

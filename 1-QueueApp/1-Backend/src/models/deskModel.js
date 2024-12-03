const mongoose = require('mongoose')

const deskSchema = new mongoose.Schema({
  desk_number:{
    type: Number,
    required: true,
    unique: true
  },
  queue_name: String,
  createdTime: {
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    },
    hour: {
      type: String,
      default: () => new Date().toISOString().slice(11, 16)
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  queues:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
    }
  ],
})

deskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    const orderedObject = {
      desk_number: returnedObject.desk_number,
      desk_id: returnedObject.id,
      createdTime: returnedObject.createdTime,
      createdBy: returnedObject.createdBy,
    }
    return orderedObject
  },
})

module.exports = mongoose.model('Desk', deskSchema)

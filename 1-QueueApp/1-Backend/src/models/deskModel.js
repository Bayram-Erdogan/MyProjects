const mongoose = require('mongoose')

const deskSchema = new mongoose.Schema({
//   desk_name : {
//     type : String,
//     required : true,
//     minLength : 3
//   },
  desk_number:{
    type:Number,
    required:true,
    unique:true
  },
  //   max_of_customer: Number,
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
  queues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
    },
  ]
})

deskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    const orderedObject = {
      //queue_name: returnedObject.queue_name,
      desk_number: returnedObject.desk_number,
      //max_of_customer:returnedObject.max_of_customer,
      id: returnedObject.id,
      createdTime: returnedObject.createdTime,
      createdBy:returnedObject.createdBy
    }
    return orderedObject
  }
})

module.exports = mongoose.model('Desk', deskSchema)
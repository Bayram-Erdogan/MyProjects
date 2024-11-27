const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    minLength : 3
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  passwordHash: String,
  createdTime: {
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)  // this line from chatGPT
    },
    hour: {
      type: String,
      default: () => new Date().toISOString().slice(11, 16) // this line from chatGPT
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    const orderedObject = {
      name: returnedObject.name,
      email: returnedObject.email,
      id: returnedObject.id,
      createdTime: returnedObject.createdTime,
      createdBy:returnedObject.createdBy
    }
    return orderedObject
  }
})

module.exports = mongoose.model('User', userSchema)
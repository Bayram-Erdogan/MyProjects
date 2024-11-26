const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    minLength : 3
  },
  password : {
    type : String,
    required : true,
    minLength : 6
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
})

staffSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

module.exports = mongoose.model('Staff', staffSchema)
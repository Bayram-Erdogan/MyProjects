const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  staffs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }
  ],
})

adminSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('Admin', adminSchema)

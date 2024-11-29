const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  queues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue'
    }
  ],
  desks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Desk'
    }
  ],
})

adminSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    const orderedObject = {
      username:returnedObject.username,
      admin_id: returnedObject.id,
      users: returnedObject.users,
      queues: returnedObject.queues,
      desks: returnedObject.desks,
    }
    return orderedObject
  }
})

module.exports = mongoose.model('Admin', adminSchema)


const User = require('../models/userModel')
const Desk = require('../models/deskModel')
const Queue = require('../models/queueModel')

const initialUsers = []
const initialDesks = []
const initialQueues = []

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const desksInDb = async () => {
  const desks = await Desk.find({})
  return desks.map(desk => desk.toJSON())
}

const queuesInDb = async () => {
  const queues = await Queue.find({})
  return queues.map(queue => queue.toJSON())
}

module.exports = {
  initialUsers, initialDesks, initialQueues, usersInDb, desksInDb, queuesInDb
}
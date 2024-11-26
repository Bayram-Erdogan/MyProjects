const config = require('./src/utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./src/utils/middleware')

const staffRouter = require('./src/routes/staffRoutes')
const adminRouter = require('./src/routes/adminRoutes')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/staffs', staffRouter)
app.use('/api/admin', adminRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
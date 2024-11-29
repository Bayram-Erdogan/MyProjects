const config = require('./src/utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./src/utils/middleware')

const userRouter = require('./src/routes/userRoutes')
const adminRouter = require('./src/routes/adminRoutes')
const loginRouter = require('./src/routes/login')
const queueRouter = require('./src/routes/queueRoutes')
const deskRouter = require('./src/routes/deskRoutes')


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

app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/login', loginRouter)
app.use('/api/queues', queueRouter)
app.use('/api/desks', deskRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
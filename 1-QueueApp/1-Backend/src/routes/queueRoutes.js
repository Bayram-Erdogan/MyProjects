const queueRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Queue = require('../models/queueModel')
const Admin = require('../models/adminModel')
const Desk = require('../models/deskModel')
const QRCode = require('qrcode')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

queueRouter.post('/', async (request, response) => {
  const body = request.body
  const desk = await Desk.findOne({ desk_number: body.desk_number })

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const admin = await Admin.findById(decodedToken.id)

  const queue = new Queue({
    queue_name: body.queue_name,
    desk: desk.id,
    desk_number: desk.desk_number,
    max_of_customer:body.max_of_customer,
    createdBy: admin._id,
    status:body.status
  })

  let qrCodeBase64
  try { //try-catch blog is from ChatGPT
    qrCodeBase64 = await QRCode.toDataURL(queue._id.toString())
    queue.qr_code = qrCodeBase64
  } catch (error) {
    console.error('QR Code generation failed:', error)
    return response.status(500).json({ error: 'Failed to generate QR Code' })
  }

  const savedQueue = await queue.save()
  admin.queues = admin.queues.concat(savedQueue._id)
  desk.queues.push(savedQueue._id)
  await admin.save().then(console.log('Queue successfully created'))

  response.json({ //response is updated from ChatGPT
    ...savedQueue.toJSON(),
    qr_code: qrCodeBase64
  })
})

queueRouter.get('/', async (request, response) => {
  const queues = await Queue.find({})
    .populate('createdBy', 'username') // populates fron ChatGPT
  response.json(queues)
})

queueRouter.get('/active', async (request, response) => {
  const active_queues = await Queue.find({ status: 'active' })
    .populate('createdBy', 'username')
  response.json(active_queues)
  //console.log(`Number of waiting : ${active_queues.max_of_customer}`)
})

queueRouter.get('/nonactive', async (request, response) => {
  const nonactive_queues = await Queue.find({ status: 'nonactive' })
    .populate('createdBy', 'username')

  response.json(nonactive_queues)
})

queueRouter.get('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await Queue.findById(request.params.id).populate('createdBy', 'username')
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }

})

queueRouter.delete('/', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Queue.deleteMany({})
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

queueRouter.delete('/:id', (request, response, next) => {

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Queue.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

queueRouter.put('/:id', async (request, response, next) => {
  const { queue_name, desk_number, max_of_customer, status } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  Queue.findByIdAndUpdate(
    request.params.id,
    { queue_name, desk_number, max_of_customer, status },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedQueue => {
      response.json(updatedQueue)
      console.log('Your data has been updated successfully')
    })
    .catch(error => next(error))
})

/* Qr routes */

queueRouter.get('/qr-code/:id', async (req, res) => {
  const queueId = req.params.id
  try { //try-catch blog is from ChatGPT
    const qrCode = await QRCode.toDataURL(queueId)
    res.json({ qr_code: qrCode })
  } catch  {
    res.status(500).json({ error: 'QR code generation failed' })
  }
})


module.exports = queueRouter
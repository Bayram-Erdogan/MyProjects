const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')
const Desk = require('../models/deskModel')
const Queue = require('../models/queueModel')
const Customer = require('../models/customerModel')
const bcrypt = require('bcrypt')
const helper = require('./qms_helper')


const api = supertest(app)

const adminLogin = async () => {
  const admin = { username: 'Admin', password: '12345678' }
  const response = await api.post('/api/signIn').send(admin).expect(200)
  return { token: response.body.token, admin_id: response.body.admin_id }
}


beforeEach(async () => {
  await Admin.deleteMany({})
  await User.deleteMany({})
  await Desk.deleteMany({})
  await Queue.deleteMany({})
  await Customer.deleteMany({})

  const adminExists = await Admin.findOne({ username: 'Admin' })
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('12345678', 10)
    const admin = new Admin({
      username: 'Admin',
      passwordHash
    })
    await admin.save()
  }
})

describe('Responses are returned as json', () => {
  test('Users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Desks are returned as json', async () => {
    await api
      .get('/api/desks')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Queues are returned as json', async () => {
    await api
      .get('/api/queues')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Admin tests.', () => {

  describe('Admin login tests.', () => {

    test('Admin can log in successfully with correct credentials', async () => {
      const validAdmin = {
        username: 'Admin',
        password: '12345678'
      }

      await api
        .post('/api/signIn')
        .send(validAdmin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Admin login fails with incorrect credentials', async () => {
      const invalidAdmin = {
        username: 'Admin',
        password: '1235678'
      }

      await api
        .post('/api/signIn')
        .send(invalidAdmin)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    })

  })

  describe('Admin can add data to the system.', () => {

    test('A valid user can be added', async () => {
      const { token } = await adminLogin()

      const newUser = {
        'name': 'Test User 1',
        'email': 'testUser_1@queue.com',
        'password': 'testUser_1'
      }
      await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const responseUser = await api.get('/api/users')

      const names = responseUser.body.map(user_name => user_name.name)
      const mails = responseUser.body.map(user_mail => user_mail.email)
      const passwords = responseUser.body.map(user_password => user_password.passwordHash)
      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
      assert(names.includes('Test User 1'))
      assert(mails.includes('testUser_1@queue.com'))
      assert(passwords.some(hash => hash !== null)) // From ChatGPT

      //console.log('User created:', responseUser.body)
    })

    test('A valid desk can be added', async () => {
      const { token, admin_id } = await adminLogin()

      const newUser = {
        name: 'Test User 1',
        email: 'testUser_1@queue.com',
        password: 'testUser_1'
      }

      const responseUser = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId = responseUser.body.user_id

      await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)

      const newDesk = {
        desk_number: 101,
        userId: userId,
        createdBy: admin_id
      }

      const responseDesk = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumbers = response.body.map(desk => desk.desk_number)
      const desksAtEnd = await helper.desksInDb()

      assert.strictEqual(desksAtEnd.length, helper.initialDesks.length + 1)
      assert(deskNumbers.includes(101))
      assert(responseDesk.body.desk_number === 101)
      assert(responseDesk.body.user === userId)

      //console.log('Desk created:', responseDesk.body)
    })

    test('A valid queue can be added', async () => {
      const { token, admin_id } = await adminLogin()

      const newUser = {
        name: 'Queue User 1',
        email: 'queue_user_1@queue.com',
        password: 'queueUser123'
      }

      const responseUser = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId = responseUser.body.user_id

      await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)

      const newDesk = {
        desk_number: 201,
        userId: userId,
        createdBy: admin_id
      }

      const responseDesk = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumber = responseDesk.body.desk_number

      const newQueue = {
        queue_name: 'Test Queue 1',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Active'
      }

      const responceQueue = await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const queueNames = response.body.map(queue => queue.queue_name)
      const queuesAtEnd = await helper.queuesInDb()

      assert.strictEqual(queuesAtEnd.length, helper.initialQueues.length + 1)
      assert(queueNames.includes('Test Queue 1'))
      assert(responceQueue.body.queue_name === 'Test Queue 1')
      assert(responceQueue.body.attached_desk === deskNumber)
      assert(responceQueue.body.max_of_customer === 10)
      assert(responceQueue.body.status === 'Active')

      //console.log('Queue created:', responceQueue.body)
    })

    test('A QR code is generated when a valid queue is added', async () => {
      const { token, admin_id } = await adminLogin()

      const newUser = {
        name: 'Queue User 1',
        email: 'queue_user_1@queue.com',
        password: 'queueUser123'
      }

      const responseUser = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId = responseUser.body.user_id

      await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)
      const newDesk = {
        desk_number: 201,
        userId: userId,
        createdBy: admin_id
      }

      const responseDesk = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumber = responseDesk.body.desk_number

      const newQueue = {
        queue_name: 'Test Queue 1',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Nonactive'
      }

      const responseQueue = await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const qrCode = responseQueue.body.qr_code

      assert(qrCode !== undefined)
      assert(typeof qrCode === 'string')  // From ChatGPT
      assert(qrCode.startsWith('data:image/png;base64,')) // From ChatGPT
    })

    test('Active queues can be viewed and counted correctly', async () => {
      const { token, admin_id } = await adminLogin()

      const newUser = {
        name: 'Queue User 1',
        email: 'queue_user_1@queue.com',
        password: 'queueUser123',
      }

      const responseUser = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId = responseUser.body.user_id

      await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)

      const newDesk = {
        desk_number: 201,
        userId: userId,
        createdBy: admin_id
      }

      const responseDesk = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumber = responseDesk.body.desk_number

      const newQueue1 = {
        queue_name: 'Test Queue 1',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Active',
      }

      await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue1)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newQueue2 = {
        queue_name: 'Test Queue 2',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Nonactive',
      }

      await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue2)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api
        .get('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const initialActiveQueues = response.body.filter(queue => queue.status === 'Active')

      const newQueue3 = {
        queue_name: 'Test Queue 3',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Active',
      }

      await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue3)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedResponse = await api
        .get('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const activeQueues = updatedResponse.body.filter(queue => queue.status === 'Active')
      // const nonActiveQueues = updatedResponse.body.filter(queue => queue.status === 'Nonactive')

      // console.log('Active queues count:', activeQueues.length)
      // console.log('Nonactive queues count:', nonActiveQueues.length)
      // console.log('Total queues count:', updatedResponse.body.length)
      assert.strictEqual(activeQueues.length, initialActiveQueues.length + 1)
    })

    test('A customer can join to the queue and queue should update.', async () => {
      const { token, admin_id } = await adminLogin()

      const newUser = {
        name: 'Queue User 1',
        email: 'queue_user_1@queue.com',
        password: 'queueUser123'
      }

      const responseUser = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId = responseUser.body.user_id

      await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)

      const newDesk = {
        desk_number: 201,
        userId: userId,
        createdBy: admin_id
      }

      const responseDesk = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumber = responseDesk.body.desk_number

      const newQueue = {
        queue_name: 'Test Queue 1',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Active'
      }

      const responseQueue = await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const queueId = responseQueue.body.queue_id

      await api.get('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newCustomer = {
        queue_id: queueId
      }

      const responseCustomer = await api
        .post('/api/customers/joinQueue')
        .set('Authorization', `Bearer ${token}`)
        .send(newCustomer)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert(responseCustomer.body.attached_queue === queueId)
      assert(responseCustomer.body.status === 'waiting')
      assert(typeof responseCustomer.body.customer_id === 'string')

      const updatedQueue = await api.get(`/api/queues/${queueId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert(updatedQueue.body.waiting_customer === 1)
      assert(updatedQueue.body.total_customer === 1)

      console.log('All queue and customer tests passed successfully!')
    })

    test('Active queues can be updated', async () => {
      const { token, admin_id } = await adminLogin()

      const newUser = {
        name: 'Queue User 1',
        email: 'queue_user_1@queue.com',
        password: 'queueUser123',
      }

      const responseUser = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId = responseUser.body.user_id

      await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)

      const newDesk = {
        desk_number: 444,
        userId: userId,
        createdBy: admin_id,
      }

      const responseDesk = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumber = responseDesk.body.desk_number

      const newQueue = {
        queue_name: 'Test Queue 1',
        desk_number: deskNumber,
        max_of_customer: 10,
        status: 'Active',
      }

      const responseQueue = await api
        .post('/api/queues')
        .set('Authorization', `Bearer ${token}`)
        .send(newQueue)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      console.log('Queues`s first Desk Number:', responseQueue.body.attached_desk)

      const newUser2 = {
        name: 'Queue User 2',
        email: 'queue_user_2@queue.com',
        password: 'queueUser123',
      }

      const responseUser2 = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser2)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userId2 = responseUser2.body.user_id

      await api
        .put(`/api/users/${userId2}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Free' })
        .expect(200)

      const newDesk2 = {
        desk_number: 222,
        userId: userId2,
        createdBy: admin_id,
      }

      const responseDesk2 = await api
        .post('/api/desks')
        .set('Authorization', `Bearer ${token}`)
        .send(newDesk2)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const deskNumber2 = responseDesk2.body.desk_number

      const updatedQueue = {
        desk_number: deskNumber2,
      }

      const updatedResponseQueue = await api
        .put(`/api/queues/${responseQueue.body.queue_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedQueue)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(updatedResponseQueue.body.attached_desk, deskNumber2)

    })

  })

})

after(async () => {
  await mongoose.connection.close()
})

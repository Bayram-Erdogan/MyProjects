const mongoose = require('mongoose')
const password = process.argv[2]

const url =
  `mongodb+srv://Bayram:${password}@phonebook.whfs0.mongodb.net/QMS?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const staffSchema = new mongoose.Schema({
    username: String,
    password: String,
  })

  const Staff = mongoose.model('Staff', staffSchema)

  // const staff = new Staff({
  //   username: 'Staff 1',
  //   password: 'staff_1',
  // })

  // staff.save().then(() => {
  //   console.log('staff saved!')
  //   mongoose.connection.close()
  // })

  Staff.find({}).then(result => {
    result.forEach(staff => {
      console.log(staff)
    })
    mongoose.connection.close()
  })
})
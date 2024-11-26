require('dotenv').config()
const app = require('./app')
const config = require('./src/utils/config')


app.listen(config.PORT, () => {
  console.log(`Server is running http://localhost:${config.PORT}`)
})
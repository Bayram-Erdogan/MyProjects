const express = require('express')
const app = express()

let staffs = [
    {
        username:"Staff 1",
        email:"staff_1@queue.com",
        password:"123456"
    },
    {
        username:"Staff 2",
        email:"staff_2@queue.com",
        password:"123456"
    }
]

app.get('/api/staffs',(request, response) =>{
    response.json(staffs)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server is running http://localhost:${PORT}`)
})
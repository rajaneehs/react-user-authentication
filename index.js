const express = require('express')
const { mongoose } = require('./config/db')
const cors = require('cors')

const {usersRouter} = require('./app/controllers/UsersController')

const PORT = 3005
const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})

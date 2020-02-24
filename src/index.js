const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, () => {

    console.log('Server is load in port 3000')

})

const Task = require('./models/task')
const User = require('./models/user')
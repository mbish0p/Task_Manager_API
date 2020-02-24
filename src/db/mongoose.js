const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }

)


// const test = new Task({
//     description: 'Take meds',
// })

// test.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })
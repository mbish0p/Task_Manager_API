const User = require('../../src/models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Task = require('../../src/models/task')

const userOneId = mongoose.Types.ObjectId()
const userOne = {
    "_id": userOneId,
    "name": "Dawid Duda",
    "email": "dejw@wp.pl",
    "password": "Admin123",
    "tokens": [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN)
    }]
}

const userTwoId = mongoose.Types.ObjectId()
const userTwo = {
    "_id": userTwoId,
    "name": "Aleksandra Ćwikła",
    "email": "aleksandra@wp.pl",
    "password": "ozesek123",
    "tokens": [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_TOKEN)
    }]
}

const firstTask = {
    "_id": mongoose.Types.ObjectId(),
    "description": "First test task",
    "completed": true,
    "owner": userOneId
}
const secondTask = {
    "_id": mongoose.Types.ObjectId(),
    "description": "Second test task",
    "completed": true,
    "owner": userTwoId
}
const thirdTask = {
    "_id": mongoose.Types.ObjectId(),
    "description": "Third test task",
    "completed": false,
    "owner": userOneId
}


const setDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(firstTask).save()
    await new Task(secondTask).save()
    await new Task(thirdTask).save()
}

module.exports = {
    userOneId,
    userOne,
    setDatabase,
    userTwo,
    userTwoId,
    firstTask
}
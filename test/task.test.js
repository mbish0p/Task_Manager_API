const { userOne, userOneId, setDatabase, userTwo, userTwoId, firstTask } = require('./fixtures/dataBase')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')

beforeEach(setDatabase)

test('Creat new task', async () => {

    const response = await request(app)
        .post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test creat task'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Requset all tasks for user one', async () => {

    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)

})

test('Second user delete first user task', async () => {

    const idFirstTask = firstTask._id
    const response = await request(app)
        .delete(`/task/${firstTask._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(firstTask._id)
    expect(task).not.toBeNull()
})
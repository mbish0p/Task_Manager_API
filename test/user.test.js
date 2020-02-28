const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const { userOne, userOneId, setDatabase } = require('./fixtures/dataBase')

beforeEach(setDatabase)

test('Creat user', async () => {

    const response = await request(app).post('/user').send({
        "name": "Mateusz Biskup",
        "email": "mateusz2@wp.pl",
        "password": "Admin123"
    }).expect(201)


    // Is user exist in database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()


    // Is response is the same as we expected
    expect(response.body).toMatchObject({
        user: {
            email: 'mateusz2@wp.pl'
        },
        token: user.tokens[0].token
    })

    // Is password is correctly storage

    expect(user.password).not.toBe("Admin123")
})


test('Login user', async () => {

    const response = await request(app).post('/user/login')
        .send({
            "email": userOne.email,
            "password": userOne.password
        }).expect(200)

    const user = await User.findById(userOneId)

    expect(response.body.token).toBe(user.tokens[1].token)


})


test('Login non-existing user', async () => {

    await request(app).post('/user/login').send({
        "email": "incorect@email.com",
        "password": "incorectPassword"
    }).expect(404)
})

test('Show me profile with auth', async () => {

    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Show me profile without auth', async () => {

    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Delete account with auth', async () => {

    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // console.log(response.body)
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()

})

test('Delete account without auth', async () => {

    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test('Send a profile pick', async () => {

    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('Updating profile data', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'lama123@wp.pl'
        })
        .expect(201)

    const user = await User.findById(userOneId)

    expect(user.email).toBe('lama123@wp.pl')
})

test('Updating non-existing properies', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Gwatemalia'
        })
        .expect(400)

})


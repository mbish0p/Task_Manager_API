const express = require('express')
const auth = require('../middlewear/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('You can upload only images'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {

    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {

    try {

        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            return new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAutentication()
        res.status(201).send({ user: user.publicData(), token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/user/login', async (req, res) => {

    try {
        const user = await User.findByCrudentials(req.body.email, req.body.password)
        const token = await user.generateAutentication()
        res.send({ user: user.publicData(), token })

    } catch (e) {
        res.status(404).send(e)
    }

})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user.publicData())
})

router.get('/user/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send(user.publicData())
    } catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'password', 'email', 'age']
    const isValid = updates.every((update) => {
        return validUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send('Invalid updates')
    }

    try {
        updates.forEach((update) => {

            req.user[update] = req.body[update]

        })

        await req.user.save()
        res.status(201).send(req.user.publicData())

    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        res.send(req.user.publicData())
    } catch (e) {
        res.status(500).send
    }
})



module.exports = router
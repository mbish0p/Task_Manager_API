const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewear/auth')

const router = new express.Router()


router.post('/task', auth, async (req, res) => {

    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// ?completed=true / ?completed=false / nothing - all tasks
// ?limit= int how many task will by showed
// ?skip= int how mant task should skip a showed antothers
// ?sort= createdAt:dec/inc
router.get('/tasks', auth, async (req, res) => {

    const match = {}

    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sort) {
        const parts = req.query.sort.split(':')
        if (parts[1] === 'inc') {
            sort[parts[0]] = 1
        }
        if (parts[1] === 'dec') {
            sort[parts[0]] = -1
        }
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/task/:id', auth, async (req, res) => {

    try {
        //const task = await Task.findById(req.params.id)

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})
router.patch('/task/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']
    const isValid = updates.every((update) => {
        return validUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send('Invalid update')
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        //const task = await Task.findById(req.params.id)

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('Task not found')
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/task/:id', auth, async (req, res) => {

    try {
        //const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Task not found')
        }

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router

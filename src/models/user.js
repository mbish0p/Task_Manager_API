const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Your password is to weak')
            }
            else if (value.length < 7) {
                throw new Error('Your password is to short')
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})


userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bycrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {

    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

userSchema.methods.publicData = function () {

    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAutentication = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

userSchema.statics.findByCrudentials = async (email, password) => {

    const user = await User.findOne({ "email": email })

    if (!user) {
        throw new Error('Unable to login - e')
    }
    //console.log(user.email)
    //console.log('bycrypt database password - ' + user.password + ' get password - ' + password)
    const isMatch = await bycrypt.compare(password, user.password)

    //console.log(isMatch)
    if (!isMatch) {
        throw new Error('Unable to login - p')
    }

    return user
}

const User = mongoose.model('User', userSchema)


module.exports = User
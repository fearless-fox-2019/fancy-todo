const { Schema, model } = require('mongoose')
const { hash } = require('../helpers/crypt')

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email field cannot be empty'],
        validate: {
            validator: function(email) {
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return emailRegex.test(email)
            },
            message: email => `${email.value} is not a valid email format`
        }
    },
    password: {
        type: String,
        required: [true, 'Password field cannot be empty'],
        minlength: 6,
        maxlength: 12
    }
}, {timestamps: true, versionKey: false})

userSchema.pre('save', function(next) {
    this.password = hash(this.password)
    next()
})

const User = model('User', userSchema)
module.exports = User
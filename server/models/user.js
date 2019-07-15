const mongoose = require('mongoose')
    , encrypt = require('../helpers/encrypt')

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please fill a name']
        },
        email: {
            type: String,
            unique: [true, 'Email has already used'],
            require: [true, 'Please fill an email'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Please fill a password']
        }
})

userSchema.pre('save', function(next){
    this.password = encrypt(this.password)
    next()
})

module.exports = mongoose.model('User', userSchema)


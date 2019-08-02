const mongoose = require('mongoose')
const {Schema} = mongoose
const Helper = require('../helpers/helper')

let validEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

let uniqueEmail = function (email) {
    return User.findOne({ email: email })
        .then(user => {
            if (user) return false
            else return true
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please fill in your name"]
    },
    email: {
        type: String,
        required: [true, "Please fill in your email"],
        validate: [
            { validator: validEmail, msg: 'Please use a valid email address' },
            { validator: uniqueEmail, msg: "Email address is already taken" }
        ]
    },
    password: {
        type: String,
        required: [true, "Please fill in your password"]
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
})

userSchema.pre('save', function (next) {
    this.password = Helper.hashPassword(this.password)
    next()
})

const User = new mongoose.model("User", userSchema)

module.exports = User
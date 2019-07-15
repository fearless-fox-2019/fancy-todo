const mongoose =  require('mongoose')
const {generateHash} = require('../helpers/bcrypt')
const Schema = mongoose.Schema;

const emailValidator = [{
    validator:function(v) {
        const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        return re.test(v)
    },
    message: props => props.value + ' is invalid email.'
},
{
    validator: function(v) {
        return new Promise ((resolve, reject) => {
            User.findOne({email: v})
            .then (member => {
                if (member){
                resolve (false)
                } else {
                resolve (true)
                }
            })
            .catch(err => {
                reject (err)
            })
        })
    },
    message: props => props.value + ' is already used.'
}]

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: emailValidator
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function(next) {
    this.password = generateHash(this.password)
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hashPassword} = require('../helpers/bcrpytPassword')

const UserSchema = new Schema({
    username: {
        type: String,
        validate: {
            validator: function(value) {
                    return mongoose.model('User',UserSchema).findOne({username: value})
                        .then((dataFound) => {
                            if(dataFound) {
                               return false
                            }
                        })
            },
            message: props => `username ${props.value} has been used`
        },
        required: [true, 'Username is required']
    },
    password:{
        type: String,
        required: [true,'Password is required']
    },
    email:{
        type: String,
        validate: [{
            validator: function(value) {
                return mongoose.model('User',UserSchema).findOne({email: this.email})
                    .then((dataFound) => {
                        // console.log(dataFound)
                        if(dataFound) {
                            console.log(dataFound)
                            return false
                        }
                    })
            },
            message: props => `${props.value} has been used...`
        },{
            validator: function(value) {
                const re = /^\S+@\S+$/
                // console.log(re.test(value))
                return re.test(value)
            },
            message: props => `${props.value} is not a valid email!`
        }],
        required: [true, 'Email is required']
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})


UserSchema.pre('save',function(next) {
    this.password = hashPassword(this.password)
    
    // console.log(this.password)
    next()
})

const User = mongoose.model('User',UserSchema)
// const mongoose = require('mongoose')


module.exports = User
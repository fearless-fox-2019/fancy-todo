const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { encrypt } = require('../helpers/bcrypt')

const userSchema = new Schema({
    name: {
        type : String,
        required : [true, 'name must be filled']
    },
    email: {
        type: String,
        required: [true, 'Please input member email'],
        validate: [{
            validator: function(input) {
                let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return input.match(mailformat)
            },
            message: props => `${props.value} invalid email format!`
            }, {
            validator: function(value) {
                return user.find({
                    _id: { $ne: this._id },
                    email: value
                })
                .then( data => {
                    if (data.length !== 0) { throw 'Email has been used'}
                })
                .catch(err => {
                    throw err
                });
            },
            message: props => `This email ${props.value} already used!`
        }]
    },
    password : {
        type : String,
        required : [true, 'user must have password!']
    }
},{
    timestamps : true
})

userSchema.pre('save', function (next) {
    this.password = encrypt(this.password)
    next()
})

const user = mongoose.model('user', userSchema)

module.exports = user
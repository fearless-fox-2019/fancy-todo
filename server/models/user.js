const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { encrypt } = require('../helpers/bcrypt')

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please input username']
    },
    email: {
        type: String,
        validate: [{
            validator: function (input) {
                var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return input.match(emailFormat)
            },
            message: props => `${props.value} invalid email`
        }, {
            validator: function (input) {
                return mongoose.model('User', userSchema)
                    .findOne({ _id: { $ne: this._id }, email: input })
                    .then(data => { 
                        if (data) return false
                    })
            },
            message: 'Email already registered!'
        
        }],
        required: [true, 'Please input your email']
    },
    password: {
        type: String,
        required: [true, 'Please input password']
    }
}, {timestamps : true});

userSchema.pre('save', function (next) {
    this.password = encrypt(this.password)
    next()
})

const User = mongoose.model('Users', userSchema);
module.exports = User
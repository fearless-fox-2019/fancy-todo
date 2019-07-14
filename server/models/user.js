const encrypt = require('../helpers/encrypt')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let emailValidators = [
    { validator :  function(value){
        return new Promise(function(resolve,reject) {
            User.findOne({ email : value })
            .then(data => {
                if(data){
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            })
        }) }, message : 'email has been registered!'
    },
    { validator: function(value) {
            let regexEmail = /\S+@\S+\.\S+/;
            if(!regexEmail.test(value)){
                return false
            }
        }, message : 'email format wrong!'
    }

]

const UserSchema = new Schema({
    name : {
        type : String,
        required : [true, 'name field can\'t be blank!']
    },
    email : {
        type : String,
        validate : emailValidators,
        required : [true , 'email required!']
    },
    password : {
        type : String,
        minlength : [6, 'password length must be more than 6 characters!'],
        required : [true, 'password required!']
    }
});

UserSchema.pre('save', function(next) {
    this.password = encrypt(this.password)
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
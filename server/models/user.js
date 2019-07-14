const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hashPassword} = require('../helpers/bcrypt')
const TodoSchema = require('./todo')

let uniqueUsername = function(username){
    return User.findOne({username : username})
    .then(result => {
        if(result) return false
        else return true
    })
    .catch(err => {
       console.log(err);
    })
}

let uniqueEmail = function(email){
    return User.findOne({email : email})
    .then(result => {
        if(result) return false
        else return true
    })
    .catch(err => {
       console.log(err);
    })
}

const UserSchema = new Schema({
    name : {
        type : String,
        required : [true, 'Please fill the name']
    },
    username : {
        type : String,
        validate : [
            {validator : uniqueUsername, msg : `Username already taken`}
        ]
    },
    email : {
        type : String,
        validate : [
            {validator : uniqueEmail, msg : `Email already used`}
        ]
    },
    password : {
        type : String,
        required : [true, `Please fill the password`],
        min : [8, "password min length is 8"],
        max : [20, "password too long, max is 20"]
    },
    
},{timestamps:true})

UserSchema.pre('save', function(next){ 
    if(!this.username){
        const id = this.id.substring(22, 24)
        this.username = this.name+id   
    }
    this.password = hashPassword(this.password)
    next()
})

UserSchema.pre('remove', function(next){
    TodoSchema.remove({UserId : this._id}).exec();
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User

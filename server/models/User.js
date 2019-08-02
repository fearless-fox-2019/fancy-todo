const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hash} = require('../helpers/bcrypt')

let userSchema = new Schema({
    name : {
        type: String,
        required: [true, "Name cannot be empty"]
    },
    email : {
        type : String,
        validate : [{
            validator : function validateFormat(email){
                let format = /\S+@\S+\.\S+/;
                return format.test(email)
            },
            message : props => `${props.value} is not a valid email`
        },
        {
            validator : function checkUnique(email){
                return new Promise ((resolve,reject)=>{
                    User.findOne({email: this.email})
                        .then((user)=>{
                            if (user){
                                resolve(false)
                            }
                            else {
                                resolve(true)
                            }
                        })
                        .catch((err)=>{
                            resolve(false)
                        })
                })
            }, message : props => `Email ${props.value} has been used`
        }],
        required : [true, 'Email required']
    },
    password : {
        type : String,
        required : [true, 'Password required']
    }
}, {timestamps: true})

userSchema.pre('save',function(next){
    this.password = hash(this.password)
    next()
})

let User = mongoose.model('Users',userSchema)

module.exports = User
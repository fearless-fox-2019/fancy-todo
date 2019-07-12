const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hash} = require('../helpers/bcrypt')

let userSchema = new Schema({
    name : {
        type: String,
        required: [true, 'Name must be filled!']
    },
    email : {
        type : String,
        validate : [{
            validator: function validateEmail(email) 
                {
                    var re = /\S+@\S+\.\S+/;
                    return re.test(email);
                },
                message: props => `${props.value} is not a valid email`
        },
        {
            validator: function checkUnique(){
                return new Promise((resolve, reject) =>{
                User.findOne({email: this.email})
                    .then(user =>{
                        if(user) {
                            resolve(false)
                        } else {
                            resolve(true)
                        }
                    })
                    .catch(err =>{
                        resolve (false)
                    })
                })
            }, message:  props => `Email ${props.value} has been used`
        }
    ],
        required : [true, 'email required'],
    },
    password: {
        type: String,
        required : [true, 'password required']
    }
})

userSchema.pre('save',function(next){
    this.password = hash(this.password)
    next()
})

let User = mongoose.model('User',userSchema)

module.exports = User
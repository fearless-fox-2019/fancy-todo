const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hash } = require('../helpers/bcrypt')

let userSchema = new Schema({
    username : {
        type : String,
        required : [true, `Input Username. `]
    },
    email : {
        type : String,
        required : [true, `Input Email. `],
        validate : [{
            validator: function (val) {
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
                    throw (`Invalid email format`)
                }
            },
            message: `Invalid email format`
        }, {
            validator: function (val) {
                return new Promise ((resolve, reject)=> {
                    User.findOne({
                        email: val
                    })
                    .then((found) => {
                        if (found) {
                            resolve (false)
                        } else {
                            resolve (true)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                })    
            },
            message: `Email has been used/ exist`
        }]
    },
    password : {
        type : String,
        required : [true, `Input Password. `],
        minlength: [5,`Password length too short`]
    },
    avatar: {
        type: String
    }
},{
    timestamps: true
})

userSchema.pre('save',function (next) {
    this.password = hash(this.password)
    next()
})

let User = mongoose.model('User',userSchema)

module.exports = User
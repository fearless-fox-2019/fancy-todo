const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

let Schema = mongoose.Schema
const userSchema = new Schema({
    username: String,
    email:{
        type:String,
        validate: [{
            validator: function(value){
                return /\S+@\S+\.\S+/.test(value)
            },
            message: props => `${props.value} is not a valid email`
        },{
            validator: function (value) {
                return User.find({
                    _id: { $ne: this._id },
                    email: value
                })
                    .then(data => {
                        if (data.length !== 0) {
                            throw new Error('Email has been used')
                        }
                    })
                    .catch(err => {
                        throw err
                    });
            },
            message: props => `This email ${props.value} already used!`

        }],
        required: [true, `email is required`]  
    },
    password:String
    // projects: [{type: Schema.Types.ObjectId, ref: 'Project'}]
},{timestamps : true})

userSchema.pre('save',function(next){
    this.password = bcrypt.hashSync(this.password,salt)
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User
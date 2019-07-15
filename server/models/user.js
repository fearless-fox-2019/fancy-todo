const mongoose = require("mongoose");
const {Schema} = mongoose;
const {hash} = require("../helpers/bcrypt");

const userSchema = new Schema({
    name: String,
    email: {
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
    picture: String,
    password: String
})

userSchema.pre("save", function(next){
    return hash(this.password)
        .then((hashedPassword) => {
            this.password = hashedPassword;
            next();
        })
        .catch((err) => {
            throw err;
        })
});


const User = mongoose.model("user", userSchema);


module.exports = User;
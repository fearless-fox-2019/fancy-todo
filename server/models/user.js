const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const { hashPassword } = require('../helpers/bcrypt');

const userSchema = new Schema({
  fullname:  {
    type : String,
    required : [true, `Please Fill in Your Name`],
    match : [/^[a-zA-Z ]*$/, `Your Name can only contain Alphabet and Space`]
  },
  username: {
    type : String,
    required : [true, `Please Provide Username for Your Account`],
    minlength : [6, `Username Too Short`],
    match : [/^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?\d+\.?\d*$].*)$/, `Username Can Only Contain Alphabet and '.', '_' or '-'`],
    unique: true 
  },
  email: {
    type : String,
    required : [true, `Please Provide Username for Your Account`],
    match : [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please Proved a Valid Email'],
    unique: true 
  },
  password: {
    type : String,
    required : [true, 'Please Provide Password for Your Account'],
    minlength : [8, `Password Must be 8 Characters or More`],
    match : [/^[a-zA-Z0-9]*$/ , 'Password can Only Contain Alpha Numeric']
  }
});

userSchema.pre('save', function(next) {
  this.password = hashPassword(this.password)
  next()
})

userSchema.plugin(uniqueValidator, { message: `Someone Already Used {VALUE} as their {PATH}` });

let User = mongoose.model('user', userSchema)

module.exports = User

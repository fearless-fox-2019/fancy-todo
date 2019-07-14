const mongoose = require("mongoose")
const Schema = mongoose.Schema
const User = require("./user")
const Todo = require("./todo")

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Project name cannot be empty"]
    },
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    todos: [{type: Schema.Types.ObjectId, ref: "Todo"}]
}, {timestamps: true})

projectSchema.pre("save", function(next) {
    if(this.name.length > 25) {
        throw({
            code: 400,
            message: "Project name cannot exceed 25 characters"
        })
    }
    next()
})


projectSchema.post("remove", function(doc) {
    console.log(doc._id, "ASDASDASD")
    User.find({projects: {$in: [doc._id]}})
    .then(users =>{
        var promises = []
        users.forEach(user =>{
            var index = user.projects.indexOf(doc._id)
            if(index !== -1) {
                user.projects.splice(index, 1)
                promises.push(user.save())
            }
        })
        return Promise.all(promises)
    })
    .then(result =>{
        return Todo.deleteMany({project: doc._id})
    })
    .then(todos =>{
        console.log(todos)
    })
    .catch(err =>{
        throw({
            code: 500,
            message: err
        })
    })
})

// projectSchema.post("save", function(doc) {
//     console.log(req.headers.decoded)
// })

module.exports = mongoose.model("Project", projectSchema)
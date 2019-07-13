const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoListModel = require('./todoListModel')
const taskModel = require('./taskModel')

let projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Project name too short']
    },
    description: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
    //  ,
    // list: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'List',
    //     default: []
    // }]
}, {
    timestamps: true
})

// projectSchema.post('findOneAndDelete', function (doc) {
//     console.log(doc,'ini adalah doc')
//     //console.log(doc.list, '<<=== list ini dari model')
//     console.log()

//     mongoose.models.List
//         .deleteMany({ _id: { $in: doc.list } })
//         .then(result=> {
//             console.log(' berhasil hore')
//             console.log(result)
//         })
//         .catch(err=>{
//             console.log(err)
//         })
// })

let Project = mongoose.model('Project', projectSchema)

module.exports = Project
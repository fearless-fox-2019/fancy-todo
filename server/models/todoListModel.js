const mongoose = require('mongoose')
const Schema = mongoose.Schema
const projectModel = require('./projectModel')

let listSchema = new Schema({
    name: {
        type: String,
        require: true,
        validate: [{
            validator: function(val) {
                return new Promise ((resolve, reject)=> {
                    List
                        .findOne({name: val})
                        .then((found)=>{
                            if(found){
                                resolve(false)
                            }
                            else {
                                resolve (true)
                            }
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                })
            },
            message: `Cannot make a same List of Task`
        }]
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    }
    // ,
    // taskId: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Task',
    //     default: []
    // }]
}, {
    timestamps: true
})

// listSchema.pre('save', function (next) {
//     if (this.projectId) {
//         console.log(this.projectId)
//         console.log(this._id, '<== ini idnya si list')
//         let listId = this._id
//         projectModel
//             .findById(this.projectId)
//             .then((found) => {

//                 found.list.push(listId)
//                 let update = new projectModel(found)
//                 update.save()
//             })
//             .catch(next)
//     }
//     next()
// })

// listSchema.post('remove',function(doc){
//     console.log(doc.task,'<==== INI TASK')

// })

let List = mongoose.model('List', listSchema)

module.exports = List
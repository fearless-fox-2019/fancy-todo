// const {Todo} = require('../models/index')
// module.exports = (req,res,next) =>{
//   Todo.findByPk(req.params.id)
//   .then(dataTodo=>{
//     if(dataTodo){
//       if(dataTodo.UserId == req.decoded.id){
//         next()
//       }
//       else{
//         throw {
//           status : 401,
//           message : 'Unauthorized'
//       }
//       }
//     }else{
//       throw {
//         status : 404,
//         message : 'Data not Found'
//       }
//     }
//   })
//   .catch(next)
// }
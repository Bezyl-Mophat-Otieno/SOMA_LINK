const mongoose = require ('mongoose')
 const skillSchema = mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,' A student must be Associated with a Skill'],
        ref:'Student'
    },
skill:{
type:String,
required:[true,'Kindly Enter Your Current Skill']
}

 }, {
    timestamps:true
 })

 module.exports = mongoose.model('Skill',skillSchema);
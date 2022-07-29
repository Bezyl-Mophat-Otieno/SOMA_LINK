const mongoose = require('mongoose')
const goalSchema = mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'a student must be associated with a goal'],
        ref:'Student'
    },
text:{
type:String,
required:[true,'please add a text field']

}



},{
    timestamps:true
})
module.exports = mongoose.model('Goal',goalSchema);
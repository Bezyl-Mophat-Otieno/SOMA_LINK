const mongoose = require('mongoose')
const goalSchema = mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'A  goal must be associated with a Logged in Student'],
        ref:'Student'
    },
text:{
type:String,
required:[true,'please add a text field']

}



},{
    timestamps:true
})
//Indexing

goalSchema.index({text:'text'})

//wildcard indexing 
// goalSchema.index({"&**":'text'})



module.exports = mongoose.model('Goal',goalSchema);
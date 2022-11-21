const mongoose = require('mongoose');
const studentSchema = mongoose.Schema({

name:{
    type:String,
    required:[true,"please enter your Name"]
    
},
 
email:{
type:String,
required:[true,"please enter your Email-Address"]

},

course:{
type:String,
required:[true,"please enter your Course Name"]
},
tel:{
    type:String,
    required:[true,"please enter your Phone Number"],
    maxlength: 15,
    unique:true,
},

password:{
    type:String,
    required:[true,"please enter your password"]
}

},
{
    timestamps:true
}
)
module.exports = mongoose.model('Student',studentSchema);
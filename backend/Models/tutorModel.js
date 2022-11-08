const mongoose = require('mongoose');
const tutorSchema = mongoose.Schema({

name:{
    type:String,
    required:[true,"please enter your Name"]
    
},
 

course:{
    type:String,
    required:[true,"please enter your Course Name"]
},
email:{
type:String,
required:[true,"please enter your Email-Address"]

},

tel:{
    type:String,
    required:[true,"please enter your Phone Number"],
    maxlength: 13,
    unique:true,
},

password:{
    type:String,
    required:[true,"please enter your password"]
},
role:{
    type:String,
    required:[true,"please enter your role"]

}



},
{
    timestamps:true
}
)
module.exports = mongoose.model('Tutor',tutorSchema);
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
password:{
    type:String,
    required:[true,"please enter your password"]
},
},
{
    timestamps:true
}
)
module.exports = mongoose.model('Tutor',tutorSchema);
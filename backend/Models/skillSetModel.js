const mongoose = require ('mongoose')
 const skillSchema = mongoose.Schema({
    student:{
        type:String,
        required:[true,'a student must be associated with a skill'],
        ref:'Student'
    },
skill:{
type:String,
required:[true,'Kindly Enter Your Current Skill']
},
status: {
    type: String,
    default: 'career-oriented',
    enum: ['career-oriented' , 'persona-oriented'],
  },

 }, {
    timestamps:true
 })

 // searching through the skill and Student field 
 skillSchema.index({skill:'text'})
 //Wildcard search 
//  skillSchema.index({"$**":'text'})

 module.exports = mongoose.model('Skill',skillSchema);
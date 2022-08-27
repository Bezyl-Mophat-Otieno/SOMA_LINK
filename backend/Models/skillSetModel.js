const mongoose = require ('mongoose')
 const skillSchema = mongoose.Schema({
    student:{
        type:String,
        required:[true,'a student must be associated with a goal'],
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

 skillSchema.index({skill:'text'})

 module.exports = mongoose.model('Skill',skillSchema);
const mongoose = require ('mongoose')
 const courseContentSchema = mongoose.Schema({
    course:{
        type:String,
        required:[true,'Course Content must reference a particular course '],
        ref:'Tutor'
    },

    tutor:{
        type:String,
        required:[true,'Notes uploaded must be done by a registered tutor'],
        ref:'Tutor'
    },
content: {
    type: String,
    required:[true,' Notes upload must contain data ']

  },

 }, 
 
 {

    timestamps:true
 })

 courseContentSchema.index({course:'text'})

 module.exports = mongoose.model('CourseContent',courseContentSchema);
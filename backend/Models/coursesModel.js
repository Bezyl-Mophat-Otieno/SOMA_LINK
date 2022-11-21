const mongoose = require('mongoose')

const CoursesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Please provide course name'],
        maxlength:50
    },

    description:{
        type:String,
        required:[true, 'Please provide provide description' ],
        maxlength:100
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref:'tutors',
        required:[true, 'Tutor id must be provided!']
    },

},{timestamps:true})

module.exports = mongoose.model('Courses',CoursesSchema)   
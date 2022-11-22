const mongoose = require('mongoose')

const registeredCoursesSchema = new mongoose.Schema({
    courseID: {
        type:mongoose.Types.ObjectId,
        ref:'courses',
        required:[true, 'Course id must be provided!']
    },
    studentID: {
        type:mongoose.Types.ObjectId,
        ref:'students',
        required:[true, 'Student must be provided!']
    },

},{timestamps:true})

module.exports = mongoose.model('registeredCourses',registeredCoursesSchema)   
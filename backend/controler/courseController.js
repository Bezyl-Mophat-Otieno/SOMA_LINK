const asyncHandler = require('express-async-handler');
const Course = require('../Models/coursesModel')
const Tutor = require('../Models/tutorModel')
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const striptags = require("striptags");
const registeredCourses = require('../Models/registeredCoursesModel');
const Student = require('../Models/studentModel');
const tutorModel = require('../Models/tutorModel');
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'image-uploads')
    },
    filename: (req,file,cb)=>{
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({storage: storage})

//@create a course
//route POST api/course
//@public

const createCourse = asyncHandler(async (req,res, next)=>{
    req.body.createdBy = req.user.id
    let errors = [];
    const {title, description} = req.body;
    console.log(req.body.createdBy)
    req.body.description = striptags(req.body.description).replace(/[\r\n]/gm, '')
    if(!title && !description){
    res.status(400)
    errors.push({msg:'Kindly Fill in the required Field'});
    res.render('tutorDashboard',{ title: 'DASHBOARD', errors,title,description})    

    } else{

        const course = await Course.create(req.body) 

        if(course){

        res.redirect('/tutorDashboard')
        }
        else{
            console.log(errors)
        }

}
})

const createCourseForm = asyncHandler(async (req, res)=>{
    let tutor = await Tutor.findById(req.user.id)
    return res.render('createCourse',{title: 'Create Course',tutor})
})


//@display Goal Update Form
//route GET api/goal/updateForm/:id
//@private


const updateGoalForm =asyncHandler ( async (req,res)=>{

    let goal = await Course.findOne({_id:req.params.id}).lean()

    if(!goal){
        res.status(400)
        res.render('error/404',{title:'404'});
        return
    } else{
    //Making sure that the student making the request is the logged in one
    if(goal.student!= req.user.id){
        res.status(401)
        res.render('error/500',{title:'500'});
        return
    } else{
    res.render('updateCourse' , {title:'UPDATE' , goal})
    return
    }
    }
    

    




})


//@Process Goal Update Form
//route PUT api/goal/update/:id
//@private


const updateCourse =asyncHandler ( async (req,res)=>{

    let goal = await Course.findById(req.params.id).lean()

    if(!goal){
        res.status(400)
        res.render('error/404',{title:'404'});
        return
    }else{
    //Making sure that the student making the request is the logged in one

    if(goal.student != req.user.id){

        res.status(401)
        res.render('error/404',{title:'404'});
        return
    } else{
           goal = await Goal.findOneAndUpdate({_id:req.params.id} , req.body , {new:true ,validators:true} );
    res.redirect('/dashboard')
    return

    }
    }
    
    




})




//@delete a goal
//route DELETE api/goal/:id
//@private

const deleteCourse =asyncHandler ( async (req,res)=>{

    let goal = await Course.findById(req.params.id).lean()

    if(!goal){
        res.status(400)
        res.render('error/404',{title:'404'});
    }else{


    //Making sure that the student making the request is the logged in one

    if(goal.student != req.user.id){

        res.status(401)
        res.render('error/404');
    }else{
    await Goal.remove({_id:req.params.id});
    res.redirect('/dashboard')
    }


    }
    

})

// Get goals 
//@route Get api/goal
//public

const getMyCourses = asyncHandler(async (req,res)=>{
    const courses = await Course.find({})
    res.status(200).json(courses)
})

const getAllCourses =asyncHandler (async(req , res )=>{
    let errors = [];
    const courses = await Course.find({});
    const totalCourses = await Course.countDocuments({});
    if(!courses){
        res.status(400)
        res.render('coursesMarket',{title:'COURSES'});
        return
    } else{
            res.render('coursesMarket' , {title:'COURSES',totalCourses, courses})
        return
    }

})

const joinCourse = asyncHandler(async (req,res)=>{
    let errors = []
    const courses = await Course.find({});
    const totalCourses = await Course.countDocuments({});
    const isRegisteredByStudent = await registeredCourses.find({courseID:new Object(req.params.id), studentID: new Object(req.user.id)})
    console.log(isRegisteredByStudent)
    if(isRegisteredByStudent.length > 0){
        res.status(400)
        errors.push({msg:'You have already joined this Course, Kindly wait for SMS Updates'})
        res.render('coursesMarket',{title:'COURSES MARKET',errors,totalCourses,courses})
    }
    else{
        student = await Student.findById(req.user.id)
        if(student){
            const registerCourse = await registeredCourses.create({
                courseID: req.params.id,
                studentID: req.user.id
            })
            console.log(registerCourse)
            if(registerCourse){
                Course.findById(req.params.id).exec((err,course)=>{
                    // console.log(course.title)
                if(course){
                    req.flash('success_msg', `You have joined ${course.title} course successfully. Kindly wait for SMS Updates from the tutor!`)
                res.redirect('/api/courses/coursesMarket')
                }
                })
                
                
            }
        }
        
    }
    
    
})

module.exports = {createCourse,createCourseForm, getAllCourses,joinCourse, updateCourse,deleteCourse,getMyCourses}
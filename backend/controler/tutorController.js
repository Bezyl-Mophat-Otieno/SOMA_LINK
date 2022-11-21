const Tutor=require('../Models/tutorModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const path = require('path')
const passport = require ('passport')
const methodOverride = require('method-override');
const crypto = require('crypto')
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose= require('mongoose');
const express = require('express')
const app = express();
const Yup = require('yup')
const Course = require('../Models/coursesModel')
const Student = require('../Models/studentModel')
const striptags = require("striptags");
const registeredCourses = require('../Models/registeredCoursesModel')
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config()


// Set app credentials
const credentials = {
    apiKey: process.env.AFRICASTALKING_APIKEY,
    username: process.env.USERNAME,
}

//Initialize the SDK
const AfricasTalking = require('africastalking')(credentials)


// GRID FS file uploading to MOngo DB
// Mongo URI
const mongoURI = process.env.MONGO_URI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });



//@desc register a Tutor 
//@route POST /api/tutor
//@ access PUBLIC
const registerTutor= asyncHandler(async (req,res)=>{
    
//Making sure all the details of the student are captured 
            const { name , course,tel, email, password ,password2 } = req.body;
let errors = [];
//Ensuring all fields are filled
            if(!name || !email || !course || !tel || !password || !password2){
  res.status(400)
  errors.push({msg:'kindly fill in all fields'});
                
            }else{
              // Phone number validation using regex pattern
              
              const phoneRegExp = /\+[1-9]{3}[0-9]{9}/g
              // schema validation using yup to validate the phone number if matches with regex pattern
              let phoneSchemaValidator =  Yup.string().matches(phoneRegExp)
              let isValid = phoneSchemaValidator.isValidSync(tel) // returns true if valid
              // Check if the phone number is valid
              if(!isValid){
                errors.push({msg: 'Enter a valid Phone Number'})
              }
              
            //Ensuring the Password is at least 6 characters
            if (password.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
              } else{
                if (password !== password2) {
                  errors.push({ msg: 'Passwords do not match' });
                }

              }

            }
//If any Error Occurs re-render register page displaying the data keyed in. 


if (errors.length > 0) {
    res.render('tutorRegister', {
      title:'REGISTER',
      errors,
      name,
      email,
      tel,
      course,
      password,
      password2
      
    });
}
else{
  //Check if a tutor already exists
  const tutorExist =await Tutor.findOne({email});
  if(tutorExist){
  res.status(400)
  errors.push({msg:'Tutor already exists'})

  res.render('tutorRegister',  {
    title:'REGISTER',
      errors,
      name,
      email,
      tel,
      course,
      password,
      password2
      
    });

  }else{
    //Generate salt that will be used in encrypting the password(hashing the password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    //Create A tutor
    console.log(req.body)
    const tutor = await Tutor.create({
    name:req.body.name,
    course:req.body.course,
    email:req.body.email,
    tel:req.body.tel,
    password:hashedPassword,
    role:"tutor",
    });

                                // if student was registered successfully
if(tutor){
  console.log(tutor);
  //Flash a message before redirecting 
  req.flash('success_msg', 'Registration Successful ! You can now login .')
  res.redirect('/tutorLogin');
  }

              }




}
});




//@desc Tutor Login
//@route POST api/tutor/login
//@access Public


const tutorLogin= asyncHandler(async (req , res , next)=>{
  
  const {email , password} = req.body;
  let errors =[];


  //If any Error Occurs re-render login page displaying the data keyed in. 
  
  if( !email ||!password){
    res.status(400)
    errors.push({msg:'kindly fill in all fields'});
                  
    }

  // re-render login page displaying the data keyed in.
  if (errors.length > 0) {
    res.render('tutorLogin',  {
      title:'LOGIN',
      errors,
      email,
      password

    });
  }else{ 
      // Login Handling
      passport.authenticate('local', {
        successRedirect: ('/tutorDashboard'),
        failureRedirect: '/tutorLogin',
        failureFlash: true
      })(req, res, next);
      return
  }

  });

//@ tutor upload files 
// POST /api/tutor/uploadFiles
//private 


const uploadFiles = asyncHandler(upload.single('file'),async(req,res)=>{
  console.log(req.user)
  res.redirect('/tutorDashboard');
})


//@ get Files 
//GET /api/tutor/getFiles
//private 
const getFiles = asyncHandler(async (req, res)=>{
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('tutor_Dashboard', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('tutor_Dashboard', { files: files });
    }
  });

})






// @ tutor Logout function
//GET /api/tutor/logout
//private 
const tutorLogout =  asyncHandler (async (req , res , next) =>{

req.logout((err)=>{
  if(err){
    return next(err);
  }

req.flash('success_msg', 'You Are Successfully Logged Out');
res.redirect('/');
});

}) 

const myCourses = asyncHandler (async (req , res )=>{
  const courses = await Course.find({createdBy:req.user.id})
  const totalCourses = await Course.countDocuments(Course.find({createdBy:req.user.id}))
  if(courses){
    res.render('tutorCoursesMarket',{title:'TUTOR COURSES',courses,totalCourses})
    return
  }
  else{
    res.status(400).json({msg:'an error occurred'})
    return
  }
})

const sendCourseUpdatesForm = asyncHandler(async(req, res)=>{
  let errors =[]
  const studentIds = await registeredCourses.find({courseID: req.params.id})
  const totalStudent = studentIds.length
  const course = await Course.findById(req.params.id)
  const tutor = await Tutor.find({_id: course.createdBy})
  if(tutor && course){

      if(totalStudent === 0){
        errors.push({msg:'No student has joined your course.You can not send any Course Updates!'})
      }
    res.render('tutorSendCourseUpdates',{title: 'COURSE UPDATES',course,tutor,totalStudent,errors })
    
  }
  return
})

const sendCourseUpdate = asyncHandler(async(req, res)=>{ 
  let errors = []
  let phoneNumbers = []
  const studentIds = await registeredCourses.find({courseID: req.params.id})
  const totalStudent = studentIds.length
  const course = await Course.findOne({courseID: new Object(req.params.id)})
  const tutor = await Tutor.findById(course.createdBy)
  console.log(tutor.tel)
  // console.log(studentIds)
  studentIds.forEach(async studentId => {
    let student = await Student.findById(studentId.studentID)
    update = req.body.topic + "\n" + striptags(req.body.updates).replace(/[\r\n]/gm, '')
    phoneNumbers.push(student.tel)
    
    
  });
  await sendMessage(phoneNumbers, update)
    .then(res => console.log(res))
    // console.log(result)
  res.redirect(`/api/tutor/sendCourseUpdatesForm/${req.params.id}`,course,errors,tutor,totalStudent)
})


let sendMessage = async(studentNumber, update)=> {
  //Get the SMS service
  const sms = AfricasTalking.SMS
  const options = {
    
      //set the numbers you want to send to international format
      to: studentNumber,
      // Set your message
      message: update,
      // Set your shortcode or senderID
      from: ''
  }
  console.log(studentNumber)
  return sms.send(options)
  
} 
    
module.exports={

registerTutor,
tutorLogin,
tutorLogout,
getFiles,
uploadFiles,
myCourses,
sendCourseUpdatesForm,
sendCourseUpdate
    };
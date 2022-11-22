const Tutor=require('../Models/tutorModel')
const Image = require('../Models/ImageStore');
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
const Student = require('../Models/studentModel');
const Course = require('../Models/coursesModel.js')
const registeredCourses = require('../Models/registeredCoursesModel.js');
const Yup = require('yup')
const expressLayouts = require('express-ejs-layouts');
const { MulterError } = require('multer');
const striptags = require('striptags');
const CourseContent = require("../Models/CourseContentModel")

// Set app credentials
const credentials = {
  apiKey: process.env.AFRICASTALKING_APIKEY,
  username: process.env.USERNAME,
}

//Initialize the SDK
const AfricasTalking = require('africastalking')(credentials)

//Get the SMS service
const sms = AfricasTalking.SMS


// GRID FS file uploading to MOngo DB
// Mongo URI
const mongoURI = process.env.MONGO_URI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', ()=>{
  gfs = new mongoose.mongo.GridFSBucket(conn.db),{
    bucketName:'uploads'
  }
})
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
//Multer Handling the storage 
const store = multer(
  { storage , 
  limits:{fileSize : 20000000},
  fileFilter:(req , file , cb) => {
    checkFileType(file , cb)

  }
  }
    
  );

 const  checkFileType = (file,cb)=>{
    const fileTypes = /jpg|png|gif|image|jpeg/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType= fileTypes.test(file.mimeType)
    if(extname || mimeType)  
    {
      cb(null , true)
    }else{
      cb('fileType');
     


    }
  }

  // Multer Upload Middleware 

  const uploadMiddleware = (req , res , next )=>{
const upload = store.single('file')
upload (req , res , (err)=>{
  if(err instanceof multer.MulterError){
    return res.status(400).send('File Too Large')
  } else if(err){
    if(err === 'fileType'){
      return res.status(400).send ('Images file only ')
    }
  }

  next()

})

  }

  //Uploading Images to the DB
  //@Route /api/tutor/uploadFiles
  // j

  const uploadController = asyncHandler(async (req , res )=>{
    const {file} = req;
    const imageUploaded = await Image.create({
      image:req.file.id
    })
    if(imageUploaded){
     res.send(file)
            }
  })

  // Fetch all files in the database
  //@ Route /api/tutor/files
  //private 

  const getAllFiles = asyncHandler(async (req,res )=>{
   const filesUploaded = await gfs.find({}).toArray((err, files)=>{
      if(!files || files.length ===0){
        res.send("NO files ")
        return
      }
      res.json(files)
      



    })
    
  })

  //fetch and display a file based on an id 
    //@ Route /api/tutor/files/:filename
    //private 
    const getSingleFile = asyncHandler(async  (req , res )=>{

      const filename= req.params.filename;
      gfs.uploads.find({filename:req.params.filename}).toArray((err,files)=>{
        console.log(files);
if(!files || files.length==0){
  res.send("No file with that name ")

}else{
  gfs.openDownloadStreamByName(req.params.filename).pipe(res);
}


      })
 
     })
  



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
} else{

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
                const tutor = await Tutor.create({
name:req.body.name,
course:req.body.course,
email:req.body.email,
password:hashedPassword,
role:req.body.role,

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
        successRedirect: '/tutorDashboard',
        failureRedirect: '/tutorLogin',
        failureFlash: true
      })(req, res, next);
      return
  }

  });

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



// @ Upploading notes by the Tutor
// POST/api/tutor/uploadNotes
//private 
const uploadNotes = asyncHandler (async ( req, res) =>{
const { course,topic, content,tutorName } = req.body ;
if(!course || !topic|| !content || !tutorName){


    res.status = 400;
    req.flash('error_msg', ' FAILED TO SEND COURSE CONTENT ! ( ensure you fill  in all fields to send notes ) ')
    res.redirect('/tutorDashboard')


}else{
    

let content = await CourseContent.create({
tutor:req.user.name,
course:req.body.course,
content: striptags (req.body.content)
})

if(content) {

    
 req.flash('success_msg', 'Notes uploaded Successfully !')
res.redirect('/tutorDashboard')

}

}


});




//@ Notes Dashboard
//@route Get api/tutor/Notes
//public


const getNotesUploaded =asyncHandler (async(req , res )=>{
  // let loggedInUser = req.user.name ;
  // const notesUploads = await CourseContent.countDocuments({})
  // const myTotalNotesUploads = await Skill.countDocuments({tutor:req.user.name});
  const notes = await CourseContent.find({}).lean();
  res.render('Notes_Dashboard',{title:'Notes',notes});
})

const sendCourseUpdate = asyncHandler(async(req, res)=>{ 
  let errors = []
  let phoneNumber = []
  const studentIds = await registeredCourses.find({courseID: req.params.id})
  const totalStudent = studentIds.length
  const course = await Course.findOne({courseID: new Object(req.params.id)})
  const tutor = await Tutor.findById(course.createdBy)
  console.log(tutor.tel)
  // console.log(studentIds)
  studentIds.forEach(async studentId => {
    let student = await Student.findById(studentId.studentID)
    console.log(student.tel)
    update = req.body.topic + "\n" + striptags(req.body.updates).replace(/[\r\n]/gm, '')
    let res = await sendMessage(student.tel, update)
    console.log(update)
    console.log(res['SMSMessageData']['Recipients'])
    console.log(student.tel)
  
  });
  console.log(phoneNumber)
  req.flash('success_msg',`Course update successfully sent!`)
  res.redirect(`/api/tutor/sendCourseUpdatesForm/${req.params.id}`,course,errors,tutor,totalStudent)
})

let sendMessage = async(studentNumber, update)=> {
  let errors = []
  const options = {
      //set the numbers you want to send to international format
      to: '+254111723326',
      // Set your message
      message: update,
      // Set your shortcode or senderID
      from: ''
  }
  return await sms.send(options)

} 

    
    

    module.exports={

registerTutor,
tutorLogin,
tutorLogout,
uploadMiddleware,
uploadController,
getAllFiles,
getFiles,
getSingleFile,
myCourses,
sendCourseUpdatesForm,
sendCourseUpdate,
uploadNotes,
getNotesUploaded

    };
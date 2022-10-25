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
const expressLayouts = require('express-ejs-layouts');




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
            const { name , course, email, password ,password2 } = req.body;
let errors = [];
//Ensuring all fields are filled
            if(!name || !email || !course || !password || !password2){
  res.status(400)
  errors.push({msg:'kindly fill in all fields'});
                
            }else{
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
res.render('login',  {
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

//@ tutor upload files 
// POST /api/tutor/uploadFiles
//private 


const uploadFiles = asyncHandler(upload.single('file'),async(req,res)=>{
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
res.redirect('/tutorLogin');
});

}) 



    
    

    module.exports={

registerTutor,
tutorLogin,
tutorLogout,
getFiles,
uploadFiles
    };
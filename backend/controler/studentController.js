const Student=require('../Models/studentModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken')
const passport = require ('passport')


//@desc register a student 
//@route POST /api/student
//@ access PUBLIC
const registerStudent= asyncHandler(async (req,res)=>{
    
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
    res.render('studentRegister', {
      title:'REGISTER',
      errors,
      name,
      email,
      course,
      password,
      password2
      
    });
} else{

            //Check if a student already exists
            const studentExist =await Student.findOne({email});
            if(studentExist){
res.status(400)
errors.push({msg:'Student already exists'})

res.render('studentRegister',  {
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

            //Create student
                const student =await Student.create({
name:req.body.name,
course:req.body.course,
email:req.body.email,
password:hashedPassword,
role:req.body.role,

                });

                                // if student was registered successfully
if(student){
  console.log(student)
  //Flash a message before redirecting 
  req.flash('success_msg', 'Registration Successful ! You can now login .')
  res.redirect('/studentLogin');
  }

              }




}
});




//@desc student Login
//@route POST api/student/login
//@access Public


const studentLogin= asyncHandler(async (req , res , next)=>{
  
  const {email , password} = req.body;
let errors =[];


//If any Error Occurs re-render login page displaying the data keyed in. 

if( !email ||!password){
  res.status(400)
  errors.push({msg:'kindly fill in all fields'});
                
            }

// re-render login page displaying the data keyed in.
if (errors.length > 0) {
res.render('studentLogin',  {
  title:'STUDENT_LOGIN',
errors,
email,
password

});

}else{
    // Login Handling
    passport.authenticate('local', {
      successRedirect: '/studentDashboard',
      failureRedirect: '/studentLogin',
      failureFlash: true
    }) 
    
    (req, res, next);

}

});

// @ Student Logout function
//GET /api/student/logout
//private 
const studentLogout =  asyncHandler (async (req , res , next) =>{

req.logout((err)=>{
  if(err){
    return next(err);
  }

req.flash('success_msg', 'You Are Successfully Logged Out');
res.redirect('/');
});

}) 


    
    

    module.exports={

registerStudent,
studentLogin,
studentLogout

    };
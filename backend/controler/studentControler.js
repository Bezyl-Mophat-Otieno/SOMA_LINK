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
            const { name , course, email, password  } = req.body;
let errors = [];
//Ensuring all fields are filled
            if(!name || !email || !course || !password){
  res.status(400)
  errors.push({msg:'kindly fill in all fields'});
                
            }else{
            //Ensuring the Password is at least 6 characters
            if (password.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
              }
            }
//If any Error Occurs re-render register page displaying the data keyed in. 


if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      course,
      password
      
    });
} else{

            //Check if a student already exists
            const studentExist =await Student.findOne({email});
            if(studentExist){
res.status(400)
errors.push({msg:"Student already exists"})

res.render('register', {
    errors,
    name,
    email,
    course,
    password
    
  });

            }else{
//Generate salt that will be used in encrypting the password(hashing the password)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt);

            //Create student
                const student = Student.create({
name:req.body.name,
course:req.body.course,
email:req.body.email,
password:hashedPassword

                });

                                // if student was registered successfully
if(student){

  //Flash a message before redirecting 
  req.flash('success_msg', 'Registration Successful ! , You can now login .')
  res.redirect('/login');
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
res.render('login', {
errors,
email,
password

});

}else{

  // Login Handling
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
    
 

}

});

const studentLogout =  asyncHandler (async (req , res ) =>{

req.logout((err)=>{
  if(err){
    return next(err);
  }

req.flash('success_msg', 'You Are Successfully Logged Out');
res.redirect('/login');
});

}) 

// Generate web Token
const generateToken = (id)=>{
return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:'30d'});

};


//@desc get student Data
//@route GET /api/students/login/me
//@ access PRIVATE
const getStudentData= asyncHandler(async  (req,res)=>{
    res.status(200).json( await req.student );
    
    })





            
    
    

    module.exports={

getStudentData,
registerStudent,
studentLogin,
studentLogout

    };
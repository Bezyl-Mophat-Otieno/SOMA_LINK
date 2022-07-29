const Student=require('../Models/studentModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken')

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
                
            }
            //Ensuring the Password is at least 6 characters


            if (password.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
              }

//If any Error Occurs render the pass back the data 


if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      course,
      password
      
    });
}


//             //Check if a student already exists
//             const studentExist =await Student.findOne({email});
//             if(studentExist){
// res.status(400)
// errors.push({msg:"Student already exists"})

// res.render('registerModal', {
//     errors,
//     name,
//     email,
//     course,
//     password
    
//   });

//             }
// //Generate salt that will be used in encrypting the password(hashing the password)
// const salt = await bcrypt.genSalt(10);
// const hashedPassword = await bcrypt.hash(password,salt);

//             //Create student
//                 const student = Student.create({
// name:req.body.name,
// course:req.body.course,
// email:req.body.email,
// password:hashedPassword

//                 })

//                 // if student was registered successfully
// if(student){
// res.render('dashboard');
// }

});

//@desc student Login
//@route POST api/student/login
//@access Public


const studentLogin= asyncHandler(async (req , res)=>{
const {email , password} = req.body;
let errors =[];
// //Check the existence of as student by the email property
// const student= await Student.findOne({email});

// if(student  && (await bcrypt.compare(password,student.password))){
    

// res.render('dashboard');


// }else{
//     res.status(400)
//     throw new Error('Invalid Credentials')
// }



//If any Error Occurs render the redirect back to login

if( !email ||!password){
  res.status(400)
  errors.push({msg:'kindly fill in all fields'});
                
            }


if (errors.length > 0) {
res.render('login', {
errors,
email,
password

});

}

});
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
studentLogin

    };
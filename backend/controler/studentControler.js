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

            if(!name || !email || !course || !password){
  res.status(400)
  res.json({msg:'kindly fill in all fields'});
                
            }
            //Check if a student already exists
            const studentExist =await Student.findOne({email});
            if(studentExist){
res.status(400)
throw new Error("Student already exists")

            }
//Generate salt that will be used in encrypting the password(hashing the password)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt);

            //Create student
                const student = Student.create({
name:req.body.name,
course:req.body.course,
email:req.body.email,
password:hashedPassword

                })

                // if student was registered successfully
if(student){
res.render('dashboard');

}
});
//@desc student Login
//@route POST api/student/login
//@access Public


const studentLogin= asyncHandler(async (req , res)=>{
const {email , password} = req.body;
const student= await Student.findOne({email});

if(student  && (await bcrypt.compare(password,student.password))){
    

res.render('dashboard');


}else{
    res.status(400)
    throw new Error('Invalid Credentials')
}


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
studentLogin

    };
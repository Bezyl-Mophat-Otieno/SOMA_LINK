const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Skill = require('../Models/skillSetModel')
const Message = require('../Models/messageModel')
const CourseContent = require('../Models/CourseContentModel')


const nodemailer = require('nodemailer')

// rendering the HOME page
//GET /
//public route
 const home = asyncHandler(async (req,res) =>{res.render('home' ,{title:'HOME' })})




// rendering the register page
// GET /studentRegister
//public routes
 const studentRegister = asyncHandler(async (req,res) =>{res.render('studentRegister',{title:'REGISTER' })})



 // rendering the tutorRegister page
// GET /tutorRegister
//public routes
const tutorRegister = asyncHandler(async (req,res) =>{res.render('tutorRegister',{title:'REGISTER' })})





//rendering the login page
//GET /studentLogin
//public routes 
  const studentLogin= asyncHandler(async(req,res) =>{res.render('studentLogin',{title:'STUDENT_LOGIN' })} )



  //rendering the  tutor login page
//GET /tutorLogin
//public routes 
const tutorLogin= asyncHandler(async(req,res) =>{res.render('tutorLogin',{title:'TUTOR_LOGIN' })} )

//Rendering My skills
//GET /mySkills
//private route
const mySkills = asyncHandler( async (req,res) =>{

    let loggedInUser = req.user.email ;
    const totalMessages = await Message.countDocuments({to:req.user.email})
  let mySkills = await Skill.find({student : req.user.email});
  

    const totalSkillsInTheMarket = await Skill.countDocuments();
    res.render('mySkills', { title:'MY-SKILLS',totalSkillsInTheMarket , mySkills , loggedInUser, totalMessages});

})


// Carry out a SEARCH operation
//@POST /search
//private route
const searching = asyncHandler( async(req,res) =>{

  const searchTerm = req.body.searchTerm
  let skillSearched = await Skill.find({$text:{$search : searchTerm  , $diacriticSensitive:true}}) ;
  console.log(skillSearched)
  
  
  res.render('search',{title:'SEARCH-RESULTS',skillSearched});

    
    
  
  })
  
// Rendering the STUDENT DASHBOARD
//@ GET /studentDashboard
//private route
  const studentDashboard =asyncHandler( async (req,res) => {

    try {
      const goals = await Goal.find({student:req.user.id}).lean()
      const myTotalSkills = await Skill.countDocuments({student:req.user.email});
      const totalMessages = await Message.countDocuments({to:req.user.email})
        const notesUploads = await CourseContent.countDocuments({})



      res.render('student_Dashboard', {student:req.user, title:'STUDENT_DASHBOARD'  , goals, myTotalSkills,totalMessages , notesUploads})
  
    } catch (error) {
      console.error(error)
      
    }
  
   })


// Rendering the  Tutor DASHBOARD
//@ GET /tutorDashboard
//private route
const tutorDashboard =asyncHandler( async (req,res) => {

  res.render('tutor_Dashboard',{tutor:req.user , title:'TUTOR_DASHBOARD'})

 })





 
  
   module.exports = {mySkills , searching , studentDashboard  , tutorDashboard , home , studentRegister,tutorRegister,studentLogin , tutorLogin } 
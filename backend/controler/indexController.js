const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Skill = require('../Models/skillSetModel')
const Message = require('../Models/messageModel')

const nodemailer = require('nodemailer')

// rendering the HOME page
//GET /
//public route
 const home = asyncHandler(async (req,res) =>{res.render('home' ,{title:'HOME' })})
// rendering the register page
// GET /register
//public routes
 const register = asyncHandler(async (req,res) =>{res.render('register',{title:'REGISTER' })})
//rendering the login page
//GET /login
//public routes 
  const studentLogin= asyncHandler(async(req,res) =>{res.render('studentLogin',{title:'STUDENT_LOGIN' })} )



  //rendering the  tutor login page
//GET /login
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

    
  
  })
  
// Rendering the STUDENT DASHBOARD
//@ GET /studentDashboard
//private route
  const studentDashboard =asyncHandler( async (req,res) => {

    try {
      const goals = await Goal.find({student:req.user.id}).lean()
      const myTotalSkills = await Skill.countDocuments({student:req.user.email});
      const totalMessages = await Message.countDocuments({to:req.user.email})


      res.render('student_Dashboard', {student:req.user, title:'STUDENT_DASHBOARD'  , goals, myTotalSkills,totalMessages})
  
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





 
  
   module.exports = {mySkills , searching , studentDashboard  , tutorDashboard , home , register,studentLogin , tutorLogin } 
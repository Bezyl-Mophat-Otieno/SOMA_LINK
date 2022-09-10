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
  const login= asyncHandler(async(req,res) =>{res.render('login',{title:'LOGIN' })} )

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

  let skillsInTheMarket = await Skill.find({status:'career-oriented'}).lean();
  let firstSkill = skillsInTheMarket[0].skill ;
  let cleanedUp = (firstSkill).replace(/[<|>|p|\/]/g,'')
  let firstObject = skillsInTheMarket[0];
  let update = {$set:{ student:firstObject.student, skill:cleanedUp , status:firstObject.status }}
  let options = {} ;

let changedDoc =Skill.updateOne(firstObject, update , options) 

console.log( changedDoc)



      let searchTerm = (req.body.search);
      let skillSearched =  await Skill.find({ $text: {$search:searchTerm , $diacriticSensitive : true}   })  ;
  
  // res.render('search', {title:'SKILL-SEARCHED' , skillSearched});
res.render('search',{ title:'SEARCH-RESULTS', skillSearched})
  if(!skillSearched){


    console.error('Something Went wrong! , Unable To SEARCH ')
      res.render('error/404',{title:'404'})
    
  }
  
    
    
    
  
  })
  
// Rendering the DASHBOARD
//@ GET /dashboard
//private route
  const dashboard =asyncHandler( async (req,res) => {

    try {
      const goals = await Goal.find({student:req.user.id}).lean()
      const myTotalSkills = await Skill.countDocuments({student:req.user.email});
      const totalMessages = await Message.countDocuments({to:req.user.email})


      res.render('dashboard', {student:req.user, title:'DASHBOARD'  , goals, myTotalSkills,totalMessages})
  
    } catch (error) {
      console.error(error)
      
    }
  
   })



  
   module.exports = {mySkills , searching , dashboard , home , register,login } 
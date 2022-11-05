const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Skill = require('../Models/skillSetModel')
const Message = require ('../Models/messageModel')

//@Add a skill
//route POST api/skill 
//@public

const addSkill = asyncHandler( async (req,res)=>{
let errors = []


req.body.user = req.user;
const { text , status} = req.body;
const goals = await Goal.find({student:req.user.id}).lean()
const totalMessages = await Message.countDocuments({to:req.user.email})
req.body.user = req.user.id ; 

    if(!text || !status){
res.status(400)
errors.push({msg:'Kindly Enter Information In All Fields'});
res.render('Student_Dashboard',{errors,goals,totalMessages})

    }else{

        let skill = await Skill.create({
            student: await req.user.email,
            skill: await req.body.text,
            status: await req.body.status
    
    
        }) 
        if(skill){
req.flash('success_msg', 'You Have  Successfully Added a Skill')
res.redirect('/mySkills')

        }

    }

    



})



//@ Skills Market
//@route Get api/skill/skillsMarket
//public


const findSkills =asyncHandler (async(req , res )=>{
    let loggedInUser = req.user.email ;
    const totalMessages = await Message.countDocuments({to:req.user.email})
    const myTotalSkills = await Skill.countDocuments({student:req.user.email});
    const skillsInTheMarket = await Skill.find({status:'career-oriented'}).lean();
    res.render('skillsMarket',{title:'SKILL-MARKET', skillsInTheMarket,myTotalSkills , loggedInUser ,totalMessages });
})


//@display skills for a particuler user
//route GET api/skill/mySkills/:email
//@private


const userSkills =asyncHandler ( async (req,res)=>{

    let loggedInUser = req.user.email ;
    let mySkills = await Skill.find({student:req.params.email}).lean()
    const totalSkillsInTheMarket = await Skill.countDocuments();
    const totalMessages = await Message.countDocuments({to:req.user.email})


    if(!mySkills){
        res.status(400)
        res.render('error/404',{title:'404'});
        return
    } else{
            res.render('mySkills' , {title:req.params.email , mySkills , totalSkillsInTheMarket,loggedInUser,totalMessages}  )
        return
    }
    }

)


//@delete a skill
//route DELETE api/skill/:id
//@private

const deleteSkill =asyncHandler ( async (req,res)=>{

    let skill = await Skill.findById(req.params.id).lean()

    if(!skill){
        res.status(400)
        res.render('error/404',{title:'404'});
    }else{


    //Making sure that the student making the request is the logged in one

    if(skill.student != req.user.email){

        res.status(401)
        res.render('error/unauthorized',{title:'401'});
    }else{ 

    await Skill.remove({_id:req.params.id});
    req.flash('success_msg', 'Skill Successfully Deletd..')
    res.redirect('/mySkills')
    }


    }
    

})





module.exports = {addSkill,findSkills,userSkills,deleteSkill}
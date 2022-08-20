const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Skill = require('../Models/skillSetModel')
//@Add a skill
//route POST api/skill 
//@public

const addSkill = asyncHandler( async (req,res)=>{
let errors = []

    if(!req.body.skill){
res.status(400)
errors.push({msg:'Kindly Add A Skill'});

    } 
    
    if(errors.length > 0){
        res.render('dashboard',{errors})
        
        
        }else{

        const skill = await Skill.create({
            student: await req.student.id,
            skill: await req.body.skill
    
    
    
        })

        if(skill){

res.redirect('/dashboard')

        }

    }

    



})



//@ My skills
//@route Get api/skill
//public


const mySkills =asyncHandler (async(req , res )=>{


    const skills = await Skill.find({student:await req.student.id});
    res.status(200).json(skills);
})


module . exports = {addSkill,mySkills}
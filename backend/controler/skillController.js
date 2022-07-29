const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Skill = require('../Models/skillSetModel')
//@Add a skill
//route POST api/skill 
//@public

const addSkill = asyncHandler( async (req,res)=>{
    if(!req.body.skill){
res.status(400)
throw new Error('Kindly fill  in the text field');

    }

    const skill = await Skill.create({
        student: await req.student.id,
        skill: await req.body.skill



    })
    res.status(200).json(skill);

})



//@ My skills
//@route Get api/skill
//public


const mySkills =asyncHandler (async(req , res )=>{


    const skills = await Skill.find({student:await req.student.id});
    res.status(200).json(skills);
})


module . exports = {addSkill,mySkills}
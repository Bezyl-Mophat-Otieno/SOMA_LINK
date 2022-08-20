const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Student = require('../Models/studentModel')
//@create a goal
//route POST api/goal
//@public

const setGoal = asyncHandler( async (req,res)=>{
let errors = [];

    if(!req.body.text){
res.status(400)
errors.push({msg:'Kindly Set A  Goal'});


    }

if(errors.length > 0){
res.render('dashboard',{errors})


} else{


    const goal = await Goal.create({
        student: await req.user.id,
        text: await req.body.text



    }) 

    if(goal){

        res.redirect('/dashboard')
    }

}
})


//@update a goal
//route PUT api/goal/:id
//@private


const updateGoal =asyncHandler ( async (req,res)=>{

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not Found');
    }
    //check for student who made the request of updating the goal
    // check the logged in student
const student = Student.findById(req.student.id);


    if(!req.student){
res.status(401)
throw new Error ('Student Not Found')

    }

    //Making sure that the student making the request is the logged in one

    if(goal.student.toString() !== req.student.id){

        res.status(401)
        throw new Error('Student Not Authorized');
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id ,req.body , {new:true} );
    res.status(200).json(updatedGoal);




})


//@delete a goal
//route DELETE api/goal/:id
//@private

const deleteGoal =asyncHandler ( async (req,res)=>{

    const goal = await Goal.findById(req.params.id).lean()

    if(!goal){
        res.status(400)
        throw new Error('Goal not Found');
    }
    //check for student who made the request of updating the goal

    if(!req.student){
res.status(401)
throw new Error ('Student Not Found')

    }

    //Making sure that the student making the request is the logged in one

    if(goal.student !== req.student.id){

        res.status(401)
        throw new Error('Student Not Authorized');
    }else{
    await goal.remove();
    res.status(200).json({id:req.params.id});
    }
})

// Get goals 
//@route Get api/goal
//public


const getGoals =asyncHandler (async(req , res )=>{


    const goals = await Goal.find({student:req.student.id});
    res.status(200).json(goals);
})

module . exports = {setGoal,updateGoal,deleteGoal,getGoals}
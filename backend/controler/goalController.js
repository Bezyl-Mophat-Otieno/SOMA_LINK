const asyncHandler = require('express-async-handler');
const Goal = require('../Models/goalModel')
const Student = require('../Models/studentModel')
//@create a goal
//route POST api/goal
//@public

const setGoal = asyncHandler( async (req,res)=>{
const goals = await Goal.find({student:req.user.id}).lean()
let errors = [];
const {text} = req.body;

    if(!text){
res.status(400)
errors.push({msg:'Kindly Enter Information In All Fields'});
res.render('dashboard',{errors,goals})

    } else{


    let goal = await Goal.create({
        student: await req.user.id,
        text: await req.body.text



    }) 

    if(goal){

        res.redirect('/dashboard')
    }

}
})


//@display Goal Update Form
//route GET api/goal/updateForm/:id
//@private


const updateGoalForm =asyncHandler ( async (req,res)=>{

    let goal = await Goal.findOne({id:req.params.id}).lean()

    if(!goal){
        res.status(400)
        res.render('error/404',{title:'404'});
        return
    } else{
    //Making sure that the student making the request is the logged in one
    if(goal.student != req.user.id){
        res.status(401)
        res.render('error/500',{title:'500'});
        return
    } else{
// console.log(goal.student);
// console.log(req.user.id)

    res.render('updateGoal' , {title:'UPDATE' , goal})
    

    return

    }
    }
    

    




})


//@Process Goal Update Form
//route PUT api/goal/update/:id
//@private


const updateGoal =asyncHandler ( async (req,res)=>{

    let goal = await Goal.findById(req.params.id).lean()

    if(!goal){
        res.status(400)
        res.render('error/404',{title:'404'});
        return
    }else{
    //Making sure that the student making the request is the logged in one

    if(goal.student != req.user.id){

        res.status(401)
        res.render('error/404',{title:'404'});
        return
    } else{
           goal = await Goal.findOneAndUpdate({_id:req.params.id} , req.body , {new:true ,validators:true} );
    res.redirect('/dashboard')
    return

    }
    }
    
    




})




//@delete a goal
//route DELETE api/goal/:id
//@private

const deleteGoal =asyncHandler ( async (req,res)=>{

    let goal = await Goal.findById(req.params.id).lean()

    if(!goal){
        res.status(400)
        res.render('error/404',{title:'404'});
    }else{


    //Making sure that the student making the request is the logged in one

    if(goal.student != req.user.id){

        res.status(401)
        res.render('error/404');
    }else{
    await Goal.remove({_id:req.params.id});
    res.redirect('/dashboard')
    }


    }
    

})

// Get goals 
//@route Get api/goal
//public


const getGoals =asyncHandler (async(req , res )=>{


    const goals = await Goal.find({student:req.student.id});
    res.status(200).json(goals);
})

module.exports = {setGoal,updateGoalForm,updateGoal,deleteGoal,getGoals}
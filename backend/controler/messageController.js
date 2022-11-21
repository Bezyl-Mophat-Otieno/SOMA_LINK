const asyncHandler = require ('express-async-handler')
const Message = require ('../Models/messageModel')
const Skill = require ('../Models/skillSetModel')
<<<<<<< HEAD
const striptags = require('striptags');

=======
const striptags = require("striptags");
>>>>>>> 62ec00bba7ea15a20a3678c30bb22f79d20ad557

// @ send a short message to the person possessing a skill you are interested in
// POST /messaging
//private 
const sendMail = asyncHandler (async ( req, res) =>{
const { to , message } = req.body ;
if(!to||!message){


    res.status = 400;
    req.flash('error_msg', ' MESSAGE NOT SENT ! ( ensure you fill  in all fields to send message ) ')
    res.redirect('/api/skill/skillsMarket')


}else{
    const { from } = req.body
let cleanedUpMessage = striptags(req.body.message).replace(/[\r\n]/gm, '')
let message = await Message.create({
from:req.user.email,
to:req.body.to,
<<<<<<< HEAD
message: striptags (req.body.message)
=======
message:cleanedUpMessage,
>>>>>>> 62ec00bba7ea15a20a3678c30bb22f79d20ad557
})

if(message) {

    
 req.flash('success_msg', 'Message Sent Successfully !')
res.redirect('/api/skill/skillsMarket')

}

}


});

// View the messages sent to me 
// GET /messaging/inbox
//private 

const inbox = asyncHandler(async(req,res)=>{
const loggedInUser = req.user.email ;
const myMessages = await Message.find({to:req.user.email}).lean()
const totalSkillsInTheMarket = await Skill.countDocuments();
const myTotalSkills = await Skill.countDocuments({student:req.user.email});
const totalMessages = await Message.countDocuments({to:req.user.email})


res.render('inbox', {title:'INBOX',myMessages , loggedInUser,myTotalSkills,totalSkillsInTheMarket,totalMessages})


})

//delete Mail 
//DELETE /messaging/delete/:id
//private 

const deleteMessage = asyncHandler(async(req,res)=>{


    await Message.remove({_id:req.params.id});
    req.flash('success_msg', 'Message Successfully deleted..')
    res.redirect('/messaging/inbox')




})



module.exports = { sendMail,inbox , deleteMessage }
const asyncHandler = require('express-async-handler')
const express =  require('express')
const router = express.Router()
const {ensureAuthenticated , forwardAuthenticated} = require ('../config/auth');
const Message = require ('../Models/messageModel')
const {sendMail,inbox, deleteMessage} = require ('../controler/messageController')
router.post('/',ensureAuthenticated,sendMail)
router.get('/inbox',ensureAuthenticated,inbox)
router.delete('/delete/:id', deleteMessage)










module.exports = router;
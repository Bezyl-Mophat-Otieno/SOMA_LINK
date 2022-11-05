
const express= require('express');
const passport = require('passport')
const app = express();
const router = express.Router()
const {registerTutor, tutorLogin, tutorLogout, getFiles, uploadMiddleware, uploadController} = require('../controler/tutorController');



router.post('/',registerTutor);
router.post('/login',tutorLogin);
router.get('/logout',tutorLogout);
router.post('/uploadFiles',uploadMiddleware,uploadController);


module.exports = router

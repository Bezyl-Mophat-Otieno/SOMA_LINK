
const express= require('express');
const passport = require('passport')
const app = express();
const router = express.Router()
const {registerTutor, tutorLogin, tutorLogout, getFiles, uploadFiles} = require('../controler/tutorController');



router.post('/',registerTutor);
router.post('/login',tutorLogin);
router.get('/logout',tutorLogout);
router.get('/getFiles',getFiles);
router.post('/uploadFiles',uploadFiles);


module.exports = router

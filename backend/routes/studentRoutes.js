const express= require('express');
const passport = require('passport')
const app = express();
const router = express.Router()
const {registerStudent, studentLogin, studentLogout} = require('../controler/studentController');



router.post('/',registerStudent);
router.post('/login',studentLogin);
router.get('/logout',studentLogout);

module.exports = router

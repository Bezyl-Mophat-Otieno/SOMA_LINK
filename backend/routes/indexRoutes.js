
const express =  require('express')
const router = express.Router()
const {ensureAuthenticated , forwardAuthenticated} = require ('../config/auth');
const Goal = require ('../Models/goalModel')
const Skill = require ('../Models/skillSetModel')
const {
    mySkills , 
    searching , 
    studentDashboard,
    tutorDashboard, 
    home ,
    studentRegister,
    tutorRegister , 
    studentLogin ,
    tutorLogin  , 
    sendMail 
} = require ('../controler/indexController')



//RENDERING MY(predefined-routes) EJS VIEWS
router.get('/',forwardAuthenticated,home)
router.get('/studentRegister',studentRegister)
router.get('/tutorRegister',tutorRegister)
router.get('/tutorLogin',tutorLogin)
router.get('/studentLogin',studentLogin)
router.get('/mySkills', ensureAuthenticated ,mySkills);
router.post('/search', ensureAuthenticated ,searching);
router.get('/studentDashboard', ensureAuthenticated,studentDashboard );
router.get('/tutorDashboard', ensureAuthenticated,tutorDashboard );





module.exports = router
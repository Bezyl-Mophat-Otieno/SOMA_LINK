
const express =  require('express')
const router = express.Router()
const {ensureAuthenticated , forwardAuthenticated} = require ('../config/auth');
const Goal = require ('../Models/goalModel')
const Skill = require ('../Models/skillSetModel')
const {mySkills , searching , dashboard, home ,register , login  , sendMail } = require ('../controler/indexController')



//RENDERING MY(predefined-routes) EJS VIEWS
router.get('/',forwardAuthenticated,home)
router.get('/register',register)
router.get('/login',login)
router.get('/mySkills', ensureAuthenticated ,mySkills);
router.post('/search', ensureAuthenticated ,searching);
router.get('/dashboard', ensureAuthenticated,dashboard );




module.exports = router
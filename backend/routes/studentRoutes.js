const express= require('express');
const app = express();
const router = express.Router()
const {registerStudent, studentLogin, studentLogout, getStudentData} = require('../controler/studentControler');
const {protect} = require('../middleware/authenticationMiddleware')


router.post('/',registerStudent);
router.post('/login',studentLogin);
router.get('/logout',studentLogout);
router.post('/login/me',protect,getStudentData);
module .exports = router

const express= require('express');
const router = express.Router()
const {createCourse, getAllCourses, getMyCourses, joinCourse} = require('../controler/courseController');
const {ensureAuthenticated , forwardAuthenticated} = require ('../config/auth.js');


router.post('/createCourse',ensureAuthenticated,createCourse);
router.get('/coursesMarket',ensureAuthenticated,getAllCourses);
router.get('/MyCoures' ,ensureAuthenticated ,getMyCourses);
router.post('/joinCourse/:id' ,ensureAuthenticated ,joinCourse);
// router.put('/update/:id',ensureAuthenticated  ,updateGoal);
// router.delete('/:id',ensureAuthenticated,deleteGoal);


module .exports = router
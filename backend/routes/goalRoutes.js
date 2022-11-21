
const express= require('express');
const router = express.Router()
const {setGoal, updateGoalForm,updateGoal, deleteGoal} = require('../controler/goalController');
const {ensureAuthenticated , forwardAuthenticated} = require ('../config/auth.js');


router.post('/',ensureAuthenticated,setGoal);
router.get('/updateForm/:id' ,ensureAuthenticated ,updateGoalForm);
router.put('/update/:id',ensureAuthenticated,updateGoal);
router.delete('/:id',ensureAuthenticated,deleteGoal);

module .exports = router
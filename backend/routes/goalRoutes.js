
const express= require('express');
const router = express.Router()
const {protect} = require('../middleware/authenticationMiddleware')
const {setGoal,updateGoal,deleteGoal,getGoals} = require('../controler/goalController');


router.post('/',setGoal);
router.get('/',getGoals);
router.delete('/:id',deleteGoal);
router.put('/:id',updateGoal);

module .exports = router

const express= require('express');
const router = express.Router()
const {protect} = require('../middleware/authenticationMiddleware')
const {setGoal,updateGoal,deleteGoal,getGoals} = require('../controler/goalController');


router.post('/',protect,setGoal);
router.get('/',protect,getGoals);
router.delete('/:id',protect,deleteGoal);
router.put('/:id',protect,updateGoal);

module .exports = router
const express = require('express');
const router = express.Router(); 
const {addSkill,mySkills} = require('../controler/skillController');
const {protect} = require('../middleware/authenticationMiddleware')



router.post('/',addSkill);
router.get('/',mySkills);

module . exports = router
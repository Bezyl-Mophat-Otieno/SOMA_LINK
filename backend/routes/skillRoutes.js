const express = require('express');
const router = express.Router(); 
const {addSkill,findSkills , userSkills ,deleteSkill } = require('../controler/skillController');
const {ensureAuthenticated , forwardAuthenticated} = require ('../config/auth.js');


router.post('/',ensureAuthenticated,addSkill);
router.get('/skillsMarket',ensureAuthenticated,findSkills);
router.get('/mySkills/:email', ensureAuthenticated , userSkills)
router.delete('/:id', ensureAuthenticated, deleteSkill )
module . exports = router
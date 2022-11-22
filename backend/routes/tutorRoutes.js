
const express= require('express');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
const app = express();
const router = express.Router()
<<<<<<< HEAD
const {registerTutor, tutorLogin, tutorLogout, uploadMiddleware, uploadController, getAllFiles, getSingleFile, uploadNotes, getNotesUploaded,viewFullNotesContent} = require('../controler/tutorController');


=======
const {
registerTutor, 
tutorLogin,
tutorLogout,
myCourse,
uploadMiddleware, 
uploadController, 
getAllFiles, 
getSingleFile, 
uploadNotes, 
getNotesUploaded,
sendCourseUpdatesForm,
sendCourseUpdate,
myCourses
} = require('../controler/tutorController');
>>>>>>> mugo_features

router.post('/',registerTutor);
router.post('/login',tutorLogin);
router.get('/myCourses',myCourses);
router.get('/sendCourseUpdatesForm/:id',sendCourseUpdatesForm);
router.post('/sendUpdates/:id',sendCourseUpdate)
router.get('/logout',tutorLogout);
router.get('/files',getAllFiles);
router.get('/files/:filename', getSingleFile);
router.post('/uploadFiles',uploadMiddleware,uploadController);
router.post('/uploadNotes',uploadNotes);
router.get('/Notes',getNotesUploaded);
router.get('/Notes/:id',viewFullNotesContent);








module.exports = router

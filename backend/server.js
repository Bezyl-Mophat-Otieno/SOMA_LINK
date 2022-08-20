const express = require('express')
const mongoose= require('mongoose');
const morgan = require('morgan')
const path = require('path')
const app =express();
const dotenv = require('dotenv').config();
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require ('connect-mongo')( session)
const PORT =process.env.PORT || 8000;
const passport = require('passport')
const Goal = require ('./Models/goalModel')
const Skill = require ('./Models/skillSetModel')

 
//Using morgan (' whenever a request  is made on  any route the route is consoled on the terminal')

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}


// Route (resource ) protection

const {ensureAuthenticated , forwardAuthenticated} = require ('./config/auth');

// Passport Config
require('./config/passport')(passport)

//Mongo DB config
const connectDB = require('./config/db');



connectDB();
//adding a body parser middleware 
app.use(express.json());

//adding a form handling data middleware
app.use(express.urlencoded({extended:false}));


 //Express session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection:mongoose.connection})
  }))

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());


  //Connect- Flash middleware 

  app.use(flash());

  // NOTE : We now have access to the req.flash.

  //Global variables (declared by the use of a Middleware)

  app.use((req , res , next)=>{

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');


next();


  })

  app.use(express.static(path.join(__dirname , 'public')))

app.set('view engine' , 'ejs');
// app.set('views' , 'backend/views');
app.set('views', path.join(__dirname, 'views'));

//Student Routing
app.use('/api/student',require('./routes/studentRoutes'))
//Goals Routing
app.use('/api/goal',require('./routes/goalRoutes'))
//Skill set Routing
app.use('/api/skill',require('./routes/skillRoutes'))
 //Using a template engine  


//RENDERING MY(predefined-routes) EJS VIEWS
app.get('/',forwardAuthenticated, (req,res) =>{res.render('home')})
app.get('/register', (req,res) =>{res.render('register')})
app.get('/login',(req,res) =>{res.render('login')})
app.get('/logout', (req,res) =>{res.render('logout')})
app.get('/setgoal', ensureAuthenticated , (req,res) =>{res.render('setGoal')});
app.get('/dashboard', ensureAuthenticated,async (req,res) => {

  try {
    const goals = await Goal.find({student:req.user.id}).lean()
    const skills = await Skill.find({student:req.user.id}).lean()

    res.render('dashboard', {student:req.user, goals })

  } catch (error) {
    console.error(error)
    
  }

 } )





app.listen(PORT,()=>{

    console.log(`server started in ${process.env.NODE_ENV} mode on port ${PORT} `);
})
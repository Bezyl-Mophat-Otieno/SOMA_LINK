const express = require('express')
const path = require('path')
const app =express();
const dotenv = require('dotenv').config();
const flash = require('connect-flash')
const session = require('express-session')
const PORT =process.env.PORT || 8000;
const passport = require('passport')

// Route (resource ) protection

const {ensureAuthenticated} = require ('./config/auth');

// Passport Config
require('./config/passport')(passport)

//Mongo DB config
const connectDB = require('./config/db');



// connectDB();
//adding a body parser middleware 
app.use(express.json());

//adding a form handling data middleware
app.use(express.urlencoded({extended:false}));


 //Express session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
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

//Student Routing
app.use('/api/student',require('./routes/studentRoutes'))
//Goals Routing
app.use('/api/goal',require('./routes/goalRoutes'))
//Skill set Routing
app.use('/api/skill',require('./routes/skillRoutes'))

app.set('view engine' , 'ejs');
// app.set('views' , 'backend/views');
app.set('views', path.join(__dirname, 'views'));

//RENDERING MY EJS VIEWS
app.get('/', (req,res) =>{res.render('home')})
app.get('/register', (req,res) =>{res.render('register')})
app.get('/login', (req,res) =>{res.render('login')})
app.get('/logout', (req,res) =>{res.render('logout')})
app.get('/dashboard', (req,res) =>res.render('dashboard')  )





app.listen(PORT,()=>{

    console.log(`server started on port ${PORT} `);
})
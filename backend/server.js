const express = require('express')
const app =express();
const mongoose= require('mongoose');
const morgan = require('morgan')
const path = require('path')
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require ('connect-mongo')( session)
const PORT =process.env.PORT || 8000;
const passport = require('passport')
const Goal = require ('./Models/goalModel')
const Skill = require ('./Models/skillSetModel')
const expressLayouts = require('express-ejs-layouts');

 
//Using morgan (' whenever a request  is made on  any route the route path is consoled on the terminal')

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

//Using method-Override since we cannot make PUT or DELETE requests when submitting forms.

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


 //Express session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    maxAge:60000,
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

   //Using a template engine  

app.set('view engine' , 'ejs');
// app.set('views' , 'backend/views');
app.set('views', path.join(__dirname, 'views'));
// ejs layouts 
app.use (expressLayouts);
app.set('layout','./layouts/main' );

//Student Routing
app.use('/',require('./routes/indexRoutes'))
app.use('/api/student',require('./routes/studentRoutes'))
//Goals Routing
app.use('/api/goal',require('./routes/goalRoutes'))
//Skill set Routing
app.use('/api/skill',require('./routes/skillRoutes'))
//Messages routing

app.use('/messaging', require('./routes/messageRoutes.js'))
//TESTING GOOGLE AUTH
app.use('/auth',require('./routes/studentRoutes' ))


app.listen(PORT,()=>{

    console.log(`server started in ${process.env.NODE_ENV} mode on port ${PORT} `);
})
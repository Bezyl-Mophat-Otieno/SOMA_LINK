const express = require('express')
const path = require('path')
const app =express();
const dotenv = require('dotenv').config();

const PORT =process.env.PORT || 8000;

const connectDB = require('./config/db');



// connectDB();
//adding a body parser middleware 
app.use(express.json());
//adding a form handling data middleware

app.use(express.urlencoded({extended:false}));



//Student Routing
app.use('/api/student',require('./routes/studentRoutes'))
//Goals Routing
app.use('/api/goal',require('./routes/goalRoutes'))
//Skill set Routing
app.use('/api/skill',require('./routes/skillRoutes'))

app.set('view engine' , 'ejs');
app.set('views' , 'backend/views');

//RENDERING MY EJS VIEWS
app.get('/', (req,res) =>res.render('home')  )
app.get('/register', (req,res) =>res.render('register')  )
app.get('/login', (req,res) =>res.render('login')  )
app.get('/dashboard', (req,res) =>res.render('dashboard')  )





app.listen(PORT,()=>{

    console.log(`server started on port ${PORT} `);
})
const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');
 const Student = require('../Models/studentModel');
 //declaring a middleware function that returns a promise

 const protect =asyncHandler(async (req,res,next)=>{
    let token;
    //checking the presence of a JWT
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

    try {

        token= req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
     
        req.student = await Student.findById(decoded.id).select('-password');
     next();
     
        
    } catch (error) {
        res.status(401);
        throw new Error('NOT AUTHORIZED');
    }


    }

    if(!token){
        res.status(401);
        throw new Error('NOT AUTHORIZED NO-TOKEN')
        
            }

    
 })

 module.exports={ protect } ;
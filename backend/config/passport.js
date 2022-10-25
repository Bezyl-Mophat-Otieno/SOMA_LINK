const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')


// Load models
const Student = require('../Models/studentModel');
const Tutor=require('../Models/tutorModel')

// LOad Tutor model


module.exports =async(passport)=>{
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
Student.findOne({email:email},(err , user)=>{
  if(err){
return done(err , null) 
} 
if(user){

  bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password Incorrect' });
        }
      });


}else{
  Tutor.findOne({email:email} , (err, user)=>{
if(err){
  return done(err , null)
}
if(user){

  bcrypt.compare(password , user.password , (err , isMatch)=>{
    if(err){
      throw err;
    }
    if(isMatch){
      return done(null , user)
    } else{
      return done(null , false, {message : 'Password Incorrect'})
    }

  });
}else {
  return done(null, false, { message: 'That Email Is Not Registered' });
}
  })
  
  

}
})
    })
  );
 
  passport.serializeUser((user, done)=> {

    done(null, user);
  });

  passport.deserializeUser((id, done)=>{
    Student.findById(id, (err, user)=> {
if(!user){
  Tutor.findById(id , (err , user)=>{

done(err , user)

  })
} else{
  done(err , user)
}

    });
  });
};
 


module.exports = {

ensureAuthenticated : (req , res, next)=>{

if(req.isAuthenticated()){
    return next
}
 req.flash('error_msg' , 'Kindly log-in to access this resource');
 res.redirect('/login');

}


    
}
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }

    if(req.user.role === 'tutor'){
       res.redirect('/tutorDashboard');   
       console.log(req.user);
    } else{
      res.redirect('/studentDashboard');  
    }
  }
};

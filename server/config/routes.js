var user                = require('../controllers/users.js');
var friendship          = require('../controllers/friendships.js');

module.exports = function(app, passport){
  app.get('/user/:id',      function(req,res) {user.get(req, res)   })
  app.get('/users/:id',     function(req,res) {user.index(req, res) })
  app.get('/login',         function(req,res) {user.nolog(req, res) })
  app.post('/request',      function(req,res) {friendship.request(req, res)})
  app.get('/pending/:id',   function(req,res) {friendship.pending(req, res)})
  app.get('/requests/:id',  function(req,res) {friendship.requested(req, res)})
  app.post('/confirm/:id',  function(req,res) {friendship.confirm(req, res)})
  app.post('/delete',       function(req,res) {friendship.delete(req, res )})
  app.post('/accept',       function(req,res) {friendship.accept(req, res )})
  // show the login form & pass any flash data if it exists
  // res.render('login.ejs', {message: req.flash('loginMessage') });
  app.post('/login',            passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an errorc
    failureFlash : true // allow flash messages
  }));
  app.get('/signup',            function(req,res) {user.fail(req, res) })
  //show the signup form & render the page and pass in any flash data
  //res.render('signup.ejs, { message: req.flash('signupMessage') });
  app.post('/signup',           passport.authenticate('local-signup', { //
    failureRedirect : '/signup' }),
    // function to specifically handle the callback and pass json back
    function(req, res) {
      console.log('RES', req.user);
      res.json({user: req.user});
  });
// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook',
                                                  { scope : 'email' }));
  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
  }));
  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get('/auth/google', passport.authenticate('google',
                          { scope : ['profile', 'email'] }));
  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
          passport.authenticate('google', {
                  successRedirect : '/profile',
                  failureRedirect : '/'
          }));

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.status({success:true}).json({
      user: req.user // get the user out of session and pass to template.
    });
  });

// =====================================
// LOGOUT ==============================
// =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.json({success: true});
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  //if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  //if they aren't redirect them to the home page
  res.redirect('/');
}

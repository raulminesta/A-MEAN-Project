var express       = require('express');
var path          = require('path');
var port          = process.env.PORT || 8080;
var passport      = require('passport');
var flash         = require('connect-flash');
var morgan        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var app           = express();

// setup for express application
app.use(express.static(path.join(__dirname, './client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
                  resave: true,
                  saveUninitialized: true })); //session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./server/config/mongoose.js');
require('./server/config/passport.js')(passport); //pass passport for configuration

var routes_setter = require('./server/config/routes.js');
routes_setter(app, passport); //load our routes and pass in our app and
                              //fully configured passport.

app.listen(port);
  console.log('*******************');
  console.log('********' + port + '*******');
  console.log('*******************');

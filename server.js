var express       = require('express');
var path          = require('path');
var https         = require('https');
var fs 						= require('fs');
var port          = process.env.PORT || 5001;
var passport      = require('passport');
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

require('./server/config/mongoose.js');
require('./server/config/passport.js')(passport); //pass passport for configuration

var routes_setter = require('./server/config/routes.js');
routes_setter(app, passport); //load our routes and pass in our app and
                              //fully configured passport.

var options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem')
};

var httpsServer = https.createServer(options, app);

httpsServer.listen(port, function() {console.log('this should work')});

// app.listen(port);
//   console.log('*******************');
//   console.log('********' + port + '*******');
//   console.log('*******************');

var express       = require('express');
var path          = require('path');
var https         = require('https');
var fs 			  = require('fs');
var port          = process.env.PORT || 5001;
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var app           = express();


// setup for express application
app.use(express.static(path.join(__dirname, './client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)




// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
                  resave: true,
                  saveUninitialized: true })); //session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./server/config/mongoose.js');
require('./server/config/passport.js')(passport); //pass passport for configuration

//  require Notie
app.use('/notie', express.static(__dirname + '/node_modules/notie'));

var routes_setter = require('./server/config/routes.js');
console.log(session);
routes_setter(app, passport, session); //load our routes and pass in our app and
                              //fully configured passport.

var options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem')
};

var httpsServer = https.createServer(options, app);

var server = httpsServer.listen(port, function() {console.log('this should work')});

// app.listen(port);
//   console.log('*******************');
//   console.log('********' + port + '*******');
//   console.log('*******************');

///////////////////////
//                   //
// SOCKET CONNECTION //
//                   //
///////////////////////

// var users = {};         <- I don't think this is needed with the way
// var users_online = [];  <- we've set up our models.

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
    console.log("We are using sockets");
    console.log(socket.id);

    socket.on("login", function(data) {

        if (!users[socket.id]) {
            users[socket.id] = {};
            users[socket.id].id = data.id;
            users[socket.id].username = data.username;
            users[socket.id].socket = socket.id;

            users_online.push(users[socket.id]);
        }


    	console.log("users-online", users_online);
    	io.sockets.emit("users-online", users_online);
    });

    socket.on("logout", function(data) {
    	delete users[socket.id];
    	for (var i = 0; i < users_online.length; i++) {
    		if (users_online[i].id == data.user._id) {
    			users_online.splice(i, 1);
    		}
    	}
    	io.sockets.emit("users-online", users_online);
    });

    socket.on("disconnect", function() {
        console.log(socket.id, "disconnected");
        delete users[socket.id];
        for (var i = 0; i < users_online.length; i++) {
            if (users_online[i].socket == socket.id) {
                users_online.splice(i, 1);
            }
        }
        io.sockets.emit("users-online", users_online);
    });

    socket.on("requestCall", function(data) {
        io.to(data.receptionSocket).emit("requestingCall", {"donorSocket": data.donorSocket, "donorName": data.donorName});
    });

    socket.on("callAccepted", function(data) {
        io.to(data.donorSocket).emit("callAccepted", {"chatroomID": data.chatroomID
                                                     });
    });

    socket.on("callDeclined", function(data) {
        io.to(data.donorSocket).emit("callDeclined");
    });
})

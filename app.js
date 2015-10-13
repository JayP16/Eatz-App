// app.js Node.js server

"use strict;"   // flag JS errors 

/* Module dependencies:
 *
 * require() loads a nodejs "module" - basically a file.  Anything
 * exported from that file (with "exports") can now be dotted off
 * the value returned by require(), in this case e.g. eatz.api
 * The convention is use the same name for variable and module.
 */
var https = require("https"),   
    express = require("./asn/node_modules/express/"), // Express Web framework   
    fs = require("fs"),
    // config is just an object, that defines attributes such as "port"
    config = require("./config"),  // app's local config - port#, etc
	mongoose = require("./asn/node_modules/mongoose/"),
	https = require('https'),
    eatz = require('./routes/eatz');  // route handlers 
var app = express();  // Create Express app server
	app.use(express.cookieParser());
	app.use(express.session({
		key: config.cookieKey,
		secret: config.cookieSecret,
		
		cookie: {

			maxAge: config.cookieNormalTime // in milliseconds (2 minutes)
		}
	}));
	//app.use(express.csrf());
	
var options = {
  key: fs.readFileSync('key.pem'),  // RSA private-key
  cert: fs.readFileSync('cert.pem')  // RSA public-key certificate
};

// Configure app server
app.configure(function() {
    // use PORT environment variable, or local config file value
    app.set('port', process.env.PORT || config.port);

    // change param value to control level of logging  
    app.use(express.logger('default'));  // 'default', 'short', 'tiny', 'dev'

    // use compression (gzip) to reduce size of HTTP responses
    app.use(express.compress());

    // parses HTTP request-body and populates req.body
    app.use(express.bodyParser({
        uploadDir: __dirname + '/public/img/uploads',
        keepExtensions: true
    }));

    // Perform route lookup based on URL and HTTP method,
    // Put app.router before express.static so that any explicit
    // app.get/post/put/delete request is called before static
    app.use(app.router);

    // location of app's static content 
    app.use(express.static(__dirname + "/public"));
	console.log(__dirname + "/public");

    // return error details to client - use only during development
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));

});


// App routes (API) - route-handlers implemented in routes/eatz.js
app.get('/auth', eatz.isAuth); 
// Heartbeat test of server API
app.post('/', eatz.api);

// Retrieve a single dish by its id attribute
app.get('/dishes/:id', eatz.getDish);

//browse all the dishes 
app.get('/dishes', eatz.getDishes);

// Upload an image file and perform image processing on it
app.post('/dishes/image', eatz.uploadImage);

// add a new dish
app.post('/dishes', eatz.addDish);

// edit an existing dish
app.put('/dishes/:id', eatz.editDish);

//delete a dish
app.delete('/dishes/:id', eatz.deleteDish);

//Login
app.get('/auth', eatz.isAuth);
app.post('/auth', eatz.signup);
app.put('/auth', eatz.loginlogout);



// Start HTTP server
https.createServer(options, app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode",
    		app.get('port'), config.env );
});
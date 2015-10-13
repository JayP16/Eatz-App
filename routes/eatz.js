"use strict";
var config = require("../config");  // app's local config - port#, etc
var mongoose = require("../node_modules/mongoose/");
var bcrypt = require("../node_modules/bcrypt/");
var gm = require("../node_modules/gm/").subClass({ imageMagick: true });
mongoose.connect("mongodb://patelj20:patelj20@mathlab.utsc.utoronto.ca/patelj20");
// Implement the eatz API:
var Dish = new mongoose.Schema({
    name: { type: String, required: true },
    venue: { type: String, required: true },
	info: {  type: [String] },
	numbr: { type: String, required: true },
	street: { type: String, required: true },
	city: { type: String, required: true },
	province: { type: String, required: true },
	url: { type: String },
	lat: { type: Number, required: true },
	lon: { type: Number, required: true },
	image: { type: String, required: true }
});

var User = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
	email: { type: String, required: true }
    
});
var UserModel = mongoose.model('Users', User); //name of collection and schema

//Models
var DishModel = mongoose.model('Dish', Dish);
// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)
exports.api = function(req, res){
  res.send(200, '<h3>Eatz API is running!</h3>');
};

// retrieve an individual dish model, using it's id as a DB key
exports.getDish = function(req, res){
        DishModel.findById(mongoose.Types.ObjectId(req.params.id), function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time (" 
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

// retrieve all the dishes in the database
exports.getDishes = function(req, res){
        DishModel.find(function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dishes at this time (" 
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, no dishes were found");
        } else {
            res.send(200, dish);
        }
    });
};

// process uploading an image
exports.uploadImage = function (req, res) {
	// req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.file.path ,   
        tmpFile = req.files.file.path.split("/").pop(),  // extract root file name 
    	imageURL = '/img/uploads/' + tmpFile,
        writeStream = __dirname + imageURL;   
    // process EditView image
    gm(filePath).resize(360, 270).write(filePath, function(err) {  
	if (!err) {
    	    res.send(imageURL);
			res.end();
	} else{
		console.log(err);
	}
    });
};

// save a new dish into the database
exports.addDish = function(req, res) {
	DishModel.find(function(err, dishes) {
		if (dishes)
		{
			var foundError = false;
			for (var x = 0; x < dishes.length; x++)
			{
				if (dishes[x].name == req.body.name && dishes[x].venue == req.body.venue)
				{
					foundError = true;
					console.log("ADD ERROR");
					res.send(500);
					res.end();
				}
			}
			if (!foundError)
			{
				var newDish = new DishModel({
				name: req.body.name,
				venue: req.body.venue,
				info: req.body.info,
				numbr: req.body.numbr,
				street: req.body.street,
				province: req.body.province,
				city: req.body.city,
				url: req.body.url,
				lat: req.body.lat,
				lon: req.body.lon,
				image: req.body.image
				});
				newDish.save();	
				
				res.end();
			}
		}
	});
	
};

// save the edited information of a dish
exports.editDish = function (req, res) {
	DishModel.find(function(err, dishes) {
		if (dishes)
		{
			var foundError = false;
			for (var x = 0; x < dishes.length; x++)
			{
				if (dishes[x].name == req.body.name && dishes[x].venue == req.body.venue && dishes[x]._id != req.params.id)
				{
					foundError = true;
					console.log("ADD ERROR");
					res.send(500);
					res.end();
				}
			}
			if (!foundError)
			{
				DishModel.findById(mongoose.Types.ObjectId(req.params.id), function(err, dish) {
				dish.name = req.body.name;
				dish.venue = req.body.venue;
				dish.info = req.body.info;
				dish.numbr = req.body.numbr;
				dish.street = req.body.street;
				dish.province = req.body.province;
				dish.city = req.body.city;
				dish.url = req.body.url;
				dish.lat = req.body.lat;
				dish.lon = req.body.lon;
				dish.image = req.body.image;
				dish.save();
				res.end();
				});
			}
		}
	});
};

// remove the dish from the db	
exports.deleteDish = function (req, res) {
	DishModel.findById(mongoose.Types.ObjectId(req.params.id), function(err, dish) {
		dish.remove(function(err) {
			if (!err)
			{
				console.log("successful delete");
			}
			else
			{
				console.log(err);
			}
		});
		res.end();
	});
};

exports.isAuth = function(req, res) {
	var sess = req.session;
	var sessUser;
	var sessId;
	if (sess.user)
		sessUser = sess.user;
	else
		sessUser = "";
	if (sess.userid)
		sessId = sess.userid;
	else
		sessId = "";
	res.send(200, {"username": sessUser, "userid": sessId});
};

// add a new user to the db
exports.signup = function(req, res) {
	//Check if the user exists
	var user = new UserModel({
				user: req.body.user,
				email: req.body.email,
				password: req.body.password
				});
	UserModel.find(function(err, users) {
		if (users)
		{
			var foundError = false;
			for (var x = 0; x < users.length; x++)
			{
				if (users[x].user == user.user)
				{
					res.send(500, "The username: " + user.user + " exists in the database.");
					res.end();
				} 
			}
		}
	});
	//Doesn't exist to encrypt password
	// generate salt value for new user 
	bcrypt.genSalt(10, function(err, salt) {
		// hash user’s plaintext with salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			user.password = hash;
			user.save(function (err, result) {
			if (!err)
			{	res.send(200, {"username": user.user, "userid": user._id});
				req.session.user = user.user;
				req.session.auth = true;
				req.session.userid = user._id; 
				}
			else {
				res.send(500, "Database Error....");
			}
			res.end();
			});
			
		});
	});

};

exports.loginlogout = function(req, res) {
	var username = req.body.user;
	var password = req.body.password;
	var loginFlag = req.body.loginlogout;
	var rememberMe = req.body.rememberMe;
	var curX;
	
	if (loginFlag == "login")
	{
		UserModel.find(function(err, users) {
				if (users)
				{
					var foundError = false;
					for (var x = 0; x < users.length; x++)
					{
						if (users[x].user == username)
						{
							var curX = x; //keep track of the x because bcrypt.compare is async
							if (!users[x])
							{
								res.send(403, "Error, returned a null user. Please try again.");
								res.end();
							}
						}
					}
					if (curX) // We found a username
					{
					bcrypt.compare(password, users[curX].password, function(err, result) {
								if (result) //successful login
								{
												if (rememberMe)
													req.session.cookie.maxAge = config.cookieExtendedTime; // 10 minutes
												req.session.user = username;
												req.session.auth = true;
												req.session.userid = users[curX]._id; 
												res.end();
								}
								else //invalid password
								{
									res.send(403, "Invalid password!");
								}
								res.end();
							});
					}
					else
					{
						res.send(500, "Could not find username " + username + " in the database");
						res.end();
					}
				}
		});
	} 
	else //assuming the flag is logout
	{
		res.send(200, {"username": "", "userid": ""});
		req.session.user = "";
		req.session.auth = false;
		req.session.userid = ""; 
		res.end();
	}
};
	


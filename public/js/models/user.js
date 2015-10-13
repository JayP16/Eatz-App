var eatz =  eatz || {};

//Dish Model
eatz.User = Backbone.Model.extend({
	
	idAttribute: "_id",
	
	defaults: {

			username: "",  // username
			password: "", //password
			passwordConfirm: "",
			email: ""
		 
	},
	
	reportedError: "",
	
	validate: function(attributes, options) {
		if (attributes.username == "") {
			return "Username is not set.";
		}
		if (attributes.email == "") {
			return "Email is not set.";
		}
		if (attributes.password == "") {
			return "Password is not set.";
		}
		if (attributes.passwordConfirm == "") {
			return "Confirmation password is not set.";
		}
		//Email confirmation 
		var x = attributes.email;
		var atpos = x.indexOf("@");
		var dotpos = x.lastIndexOf(".");
		if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
			return "Invalid Email address.";
		}
		
		if (attributes.password != attributes.passwordConfirm)
		{
			return "Passwords don't match";
		}
	},
	
	initialize: function() {
	this.on("invalid", function(model, error){
	this.reportedError = String(error);
	});

	}
	  

});
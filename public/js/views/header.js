var eatz =  eatz || {};

eatz.HeaderView = Backbone.View.extend({

    initialize: function () {
	this.render();
    },

    render: function () {
		console.log("render header");
		this.$el.html(this.template());  // create DOM content for HeaderView
		return this;    // support chaining
    },
	
	events: {
		"click .signUpButton": "signup",
		"click .signInButton": "signIn",
		"click .signOutButton": "logout",
		"change input[name=sort]:radio" : "refreshBrowse",
		"click #menuBut": "selectMenuItem"

	},
	
	selectMenuItem: function(menuItem) {
		console.log(menuItem);
		$(".noSelect").css({"color" : ""});
		menuItem.currentTarget.style.color = "white";
	},
	
	refreshBrowse: function (e) {
		eatz.pubSub.trigger('eventName', $("input[name=sort]:radio").val());
	},
	logout: function () {
		$(".signInDropdown").dropdown("toggle");
		$.ajax({
				url: '/auth',
				type: 'PUT',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({'loginlogout': "logout"})
			})
			.done(function (err, n) {
				$('#displaySignInUserInfo').hide();
				$('.signInDropdown').html('Sign In <b class="caret"></b>');
				$('#displaySignIn').show();
				eatz.utils.showNotice("alert-success", "You have successfully logged out!");
			})
			.fail(function(err, n) {
				eatz.utils.showNotice("alert-danger", err.responseText); 
			}); //will call notifications here
	},
	signIn: function() {
			var user = _.escape($('#signInUsername').val());
			var password = _.escape($('#signInPassword').val());
			var rememberChecked = $('#rememberMe').is(':checked');
			$('#signInUsername').val("");
			$('#signInPassword').val("");
			$(".signInDropdown").dropdown("toggle");
			$.ajax({
				url: '/auth',
				type: 'PUT',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({'user': user, 'password': password, 'loginlogout': "login", 'rememberMe': rememberChecked})
			})
			.done(function (err, n) {
				$('.signInDropdown').html(user + ' <b class="caret"></b>');
				$('#displaySignIn').hide();
				$('#displaySignInUserInfo').show();
				$('#displaySignInUsername').html(user);
				eatz.utils.showNotice("alert-success", "Welcome back to the app - " + user);
			})
			.fail(function(err, n) {
				eatz.utils.showNotice("alert-danger", err.responseText); 
			}); //will call notifications here
	},
	signup: function() {
		//Grab input data from form
		var user = _.escape($('#signupUsername').val());
		console.log(user);
		var mail = _.escape($('#signupEmail').val());
		var pass = _.escape($('#signupPass').val());
		var passc = _.escape($('#signupPassConfirm').val());
		
		$('#signupUsername').val("");
		$('#signupEmail').val("");
		$('#signupPass').val("");
		$('#signupPassConfirm').val("");
		$(".signUpDropdown").dropdown("toggle");
		//Create User model
		
		var newUser = new eatz.User({
			username: user,
			password: pass,
			passwordConfirm: passc,
			email: mail
		});
		
		if (newUser.isValid())
		{
			//Check server for non existing username
		$.ajax({
		url: '/auth',
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({'user': newUser.get('username'), 'password': newUser.get('password'), 'email': newUser.get('email')})

		})
		.done(function (err, n) {
			$('.signInDropdown').html(newUser.get('username') + ' <b class="caret"></b>');
			$('#displaySignIn').hide();
			$('#displaySignInUserInfo').show();
			$('#displaySignInUsername').html(newUser.get('username'));
			eatz.utils.showNotice("alert-success", "You have successfully signed up!");
			})
		.fail(function(err, n) {
		eatz.utils.showNotice("alert-danger", err.responseText); 
		}); //will call notifications here

		}
		else
		{
			var errorMessage;
			if (newUser.get("username") == "")
				errorMessage = "A username is a required field to sign up";
			else if (newUser.get("email") == "")
				errorMessage = "Email is a required field to sign up";
			else if (newUser.get("password") == "")
				errorMessage = "A password is required to sign up";
			else if (newUser.get("passwordConfirm") == "")
				errorMessage = "The second password field is required to sign up";
			else if (newUser.get("password") != newUser.get("passwordConfirm"))
				errorMessage = "The two passwords that have been entered must match";
			else {
			var x = newUser.get("email");
			var atpos = x.indexOf("@");
			var dotpos = x.lastIndexOf(".");
			if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
			errorMessage  = "Invalid Email address.";
			}
			else
			{
				errorMessage = "OUR BAD!";
			}
			}
			eatz.utils.showNotice("alert-danger", errorMessage);
		}

	}

});

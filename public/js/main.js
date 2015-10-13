var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({
	
	/*
	Create routes
	*/
    routes: {
        "": "home",
		"about" : "about",
		"dishes/add": "add",
		"dishes": "browse",
		"dishes/:id" : "edit",
    },
	
	/*
	Initialize with header view
	*/
    initialize: function() {
	if (!this.headerView) {
            this.headerView = new eatz.HeaderView();
        };
	$('#head').html(this.headerView.el);
	this.home;
	$.getJSON("auth", function(result){
		if (result.username != "")
		{
			$('.signInDropdown').html(result.username + ' <b class="caret"></b>');
			$('#displaySignIn').hide();
			$('#displaySignInUserInfo').show();
			$('#displaySignInUsername').html(result.username);
		}
	});
	
	this.on("route", function(route, params) {
		console.log("Different Page: " + route);
		$.getJSON( '/auth', function( data ) {
			if (data.username)
			{
				console.log("logged in");
			}
			else
			{
				$('#displaySignInUserInfo').hide();
				console.log("not logged in");
				$('.signInDropdown').html('Sign In <b class="caret"></b>');
				$('#displaySignIn').show();
			}
		});
	});
    },

	//Create Home View
    home: function() {
        if (!this.homeView) {
            this.homeView = new eatz.HomeView();
        };
        $('#content').html(this.homeView.el);
		eatz.utils.hideNotice(); //Hide notice
    },
	
	//Create About View
	about: function() {
	
		if (!this.aboutView) {
            this.aboutView = new eatz.AboutView();
        };
		
		$('#content').html(this.aboutView.el);
		eatz.utils.hideNotice(); //Hide notice  
		
	},
	
	//Create Browse View
	browse: function(){
		if (!this.dishesView) {
            this.dishesView = new eatz.DishesView();
        };
		this.dishesView.render();
		$('#content').html(this.dishesView.el);
		eatz.utils.hideNotice(); //Hide notice
		
	},

	
	//Create Add View - Note: Add not Edit!!
	add: function(){
		var tempDishs = new eatz.Dish();
        this.addView = new eatz.EditView({model: tempDishs});
		this.addView.template(this.addView.model.attributes);
		$('#content').html(this.addView.el);
		//Fill the fields with eatz.Dish default values
		eatz.utils.hideNotice();
		this.addView.delegateEvents();
		this.addView.valid();
		
	},
	
	//Create Edit View - Note: Edit not Add!
	edit: function(id){ //Take the model's id as a parameter
			$.getJSON("dishes/" + id,function(result){
				var newDish = new eatz.Dish({
				name : result.name,
				venue : result.venue,
				info : result.info,
				numbr : result.numbr,
				street : result.street,
				city : result.city,
				province : result.province,
				url : result.url,
				lat: result.lat,
				lon: result.lon,
				image: result.image
				});

				this.addView = new eatz.EditView({model: newDish});
				this.addView.template(this.addView.model.attributes);
				$('#content').html(this.addView.el);
				$('#editId').val(id); //had to jquery this because adding there is no _id ina new model
			});  
		//Fill the fields from the Model id
		//$('#content').html(this.addView.el);
		//document.getElementById('img-upload').style.display = 'block';
		

		eatz.utils.hideNotice(); //Hide notice when starting an add or edit page.
		this.addView.delegateEvents();
		this.addView.valid();
	},	
});

eatz.pubSub = _.extend({}, Backbone.Events);
	eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView','DishView', 'DishesView', 'EditView', 'MapView'], function() {
	    app = new eatz.AppRouter();
	    Backbone.history.start();
	});


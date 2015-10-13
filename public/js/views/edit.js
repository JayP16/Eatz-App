var eatz =  eatz || {};

// note View-name (HomeView) matches name of template HomeView.html
function test(results) { //callback for the use location request to geocoder
$("#streetNumber").val(results.stnumber);
$("#city").val(results.city);
$("#streetName").val(results.staddress);
$("#province").val(results.prov);
console.log(results);
}
eatz.EditView = Backbone.View.extend({
	//Initialize Edit View
	x: "",
	
	lat: 43.784925,
	lon: -79.185323,
	
    initialize: function () {
		this.lat = this.model.attributes.lat;
		this.lon = this.model.attributes.lon;
		this.map();
		this.render();
		this.valid();
		
    },
	
	//Events for the edit view - Clicking the save or edit button
	events: {
		"click .saveButton": "checkLoggedIn",
		"click .deleteButton": "deleteButton",
		"click .useLocationButton": "useLocation",
		"change .file": "select",
		"dragover #holder": "ondragover",
		"dragend #holder" : "ondragend",
		"drop #holder" : "ondrop"
	},
    render: function () {
		
		//this.$el.html(this.template());  // create DOM content for HomeView
		this.$el.html(this.template(this.model.attributes));
		that = this;
		setTimeout(function(){
			that.map();
			that.mapView.setElement(this.$('#map')).render();
		google.maps.event.trigger(that.mapView.map, "resize");
		}, 100);
		return this;    // support chaining
    },
	
	checkLoggedIn: function() {
	that = this;
	$.getJSON("auth",function(result){
			var username = result.username;
			if (username == "")
			{
				eatz.utils.showNotice("alert-danger", "You must be logged in to save dishes.");
			}
			else
			{
				
				that.saveButton();
			}
		});
	},
	
	//Create Browse View
	map: function(){
		/*if (!this.mapView) {
			var mapMod = new eatz.Map();
            
        };	*/
		var mapMod = new eatz.Map({
			zoom: 16,
			center: new google.maps.LatLng(this.lat, this.lon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.mapView = new eatz.MapView({model: mapMod});
		console.log(this.mapView.map);
		google.maps.event.trigger(this.map, "resize"); 
		return this;
	},
	
	// get the current location of the user through browsers geolocation
	useLocation: function()
	{
		if (navigator.geolocation) {
			that = this;
			navigator.geolocation.getCurrentPosition(function (position) { 
				var mylat = position.coords.latitude;
				var mylon = position.coords.longitude;
				that.lat = mylat;
				that.lon = mylon;
				that.map();
				that.mapView.setElement(that.$('#map')).render();
				
				$.ajax({
					url: "https://geocoder.ca/?latt=" + that.lat + "&longt=" + that.lon + "&reverse=1&geoit=XML&jsonp=1&callback=test",
					// the name of the callback parameter, as specified by the YQL service
					jsonp: "test",
					// tell jQuery we're expecting JSONP
					dataType: "jsonp",
			
					success: function( response ) {
						console.log( response ); // server response
					}
				});
		
			});
		}
		else {
			alert("Browser doesn't support geolocation");
		}
	},
	select: function(e)
	{

		var holder = document.getElementById('holder'),
		tests = {
		  filereader: typeof FileReader != 'undefined',
		  dnd: 'draggable' in document.createElement('span'),
		  formdata: !!window.FormData,
		};
		this.pictureFile = e.target.files[0];
		console.log("cooommmee herere");
		if (tests.dnd) { 
			readfiles(e.target.files, tests);		  
		}
	},
	
	// for drag and drop upload of images
	ondragover: function(e)
	{				
		e.preventDefault();

		var holder = document.getElementById('holder'),
		tests = {
		  filereader: typeof FileReader != 'undefined',
		  dnd: 'draggable' in document.createElement('span'),
		  formdata: !!window.FormData,
		};
		
		if (tests.dnd) { 
		  holder.ondragover = function () { this.className = 'hover'; return false; };		  
		}
		
	},
	ondragend: function(e)
	{				
		if (tests.dnd) { 
		  holder.ondragend = function () { this.className = ''; return false; };
		}
	},
	
	//upload the image once dropped in the container
	ondrop: function(e)
	{			
		e.preventDefault();
        e.stopPropagation();
		console.log(e);
        var ee = e.originalEvent,
			tests = {
		  filereader: typeof FileReader != 'undefined',
		  dnd: 'draggable' in document.createElement('span'),
		  formdata: !!window.FormData,
		};
        ee.dataTransfer.dropEffect = 'copy';
        this.pictureFile = ee.dataTransfer.files[0];
		
		
		if (tests.dnd) { 
			readfiles(ee.dataTransfer.files, tests);		  
		}
	},
	//Save Button function
	saveButton: function()
	{
		console.log("SAVING NOW");
		//Check all of the input forms' validity with myValidator
		var myValidator = true,
		that = this;
		myValidator = this.validateName() && myValidator;
		myValidator = this.validateVenue() && myValidator;
		myValidator = this.validateUrl() && myValidator;
		myValidator = this.validateAddress() && myValidator;
		myValidator = this.validateProvince() && myValidator;
		if (myValidator)
		{
			// Upload picture file if a new file was dropped in the drop area
			if (this.pictureFile) {
				//this.model.set("picture", this.pictureFile.name);
				eatz.utils.uploadFile(this.pictureFile,
					function (imageName) {
						that.saveNew(imageName);
					});
			} else {
				this.saveNew();
			}
		}
		return this;
	},
	
	saveNew: function(imageName)
	{
		if (!imageName)
		{
			imageName = document.getElementById("hiddenImage").value;
		}
		if ($('#editId').val()) //Check if we're editing
		{
				//Set the url field to N/A if it's empty
				if (document.getElementById("url").value == "")
				{
					document.getElementById("url").value= 'N/A';
				}
				var newDish = new eatz.Dish({
				name : _.escape(document.getElementById("dishName").value),
				venue : _.escape(document.getElementById("venue").value),
				info : _.escape(document.getElementById("info").value),
				numbr : _.escape(document.getElementById("streetNumber").value),
				street : _.escape(document.getElementById("streetName").value),
				city : _.escape(document.getElementById("city").value),
				province : _.escape(document.getElementById("province").value),
				url : _.escape(document.getElementById("url").value),
				lat : this.lat,
				lon: this.lon,
				image : imageName
				});
				$.ajax({
				url: '/dishes/' + $('#editId').val(),
				type: 'PUT',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({'name': newDish.get('name'), 'venue': newDish.get('venue'), 'info': newDish.get('info'),
				'numbr': newDish.get('numbr'), 'street': newDish.get('street'), 'city': newDish.get('city'), 'province': newDish.get('province'), 'url': newDish.get('url'), 'image': newDish.get('image'), 'lat': newDish.get('lat'), 'lon': newDish.get('lon')})
				})
				.done(function () {
					eatz.utils.showNotice("alert-success", "The dish was successfully updated!");
					
					})
				.fail(function() {
				eatz.utils.showNotice("alert-danger", "Sorry, the dish " + newDish.get('name') + " at " + newDish.get('venue') + " is already in the database"); 
				
				}); //will call notifications here

				$('#editId').val(''); //reset editId after editing or else it will continously have the same value
		}
		else{
			//Create a new dish model from the fields
			var newDish = new eatz.Dish({
				name : _.escape(document.getElementById("dishName").value),
				venue : _.escape(document.getElementById("venue").value),
				info : _.escape(document.getElementById("info").value),
				numbr : _.escape(document.getElementById("streetNumber").value),
				street : _.escape(document.getElementById("streetName").value),
				city : _.escape(document.getElementById("city").value),
				province : _.escape(document.getElementById("province").value),
				url : _.escape(document.getElementById("url").value),
				lat : this.lat,
				lon: this.lon,
				image : imageName
			});
			
			//Send post to server, include all information about dish.
			$.ajax({
			url: '/dishes',
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({'name': newDish.get('name'), 'venue': newDish.get('venue'), 'info': newDish.get('info'),
			'numbr': newDish.get('numbr'), 'street': newDish.get('street'), 'city': newDish.get('city'), 
			'province': newDish.get('province'), 'url': newDish.get('url'), 'image': newDish.get('image'), 'lat': newDish.get('lat'), 'lon': newDish.get('lon')})
			})
			.done(function () {
				//Can call another ajax here.
	
				eatz.utils.showNotice("alert-success", "Added dish " + newDish.get('name') + " from " + newDish.get('venue') + " to the database");
				
				})
			.fail(function() { 
			eatz.utils.showNotice("alert-danger", "Sorry, the dish " + newDish.get('name') + " at " + newDish.get('venue') + " is already in the database");
			
			}); //will call notifications here
		}
	},
	
	//Delete Button function
	deleteButton: function()
	{
		if ($('#editId').val()) //Check if we're editing
		{
			console.log("ATTEMPTING TO DELETE");
			var dname;
			var dvenue;
			$.getJSON( '/dishes/' + $('#editId').val(), function( data ) {
			dname = data.name;
			dvenue = data.venue;
			});
			$.ajax({
            url: '/dishes/' + $('#editId').val(),
            type: 'DELETE'
			})
			.done(function () {
					eatz.utils.showNotice("alert-success", "Deleted dish " + dname + " from " + dvenue + " from the database");
					
				})
			.fail(function() {
					eatz.utils.showNotice("alert-danger", "Sorry, we couldn't delete the dish " + dname + " at " + dvenue + " from the database"); 
					
				}); //will call notifications here
			$('#editId').val(''); //Reset id
			//window.location.href = "#dishes"; //Go to browse view
			
		}
	},
	

				
//Run on changes
	valid: function(){
	this.$("#url").change($.proxy(this.validateUrl, this));
	this.$("#dishName").change($.proxy(this.validateName, this));
	this.$("#venue").change($.proxy(this.validateVenue, this));
	this.$("#info").change($.proxy(this.validateInfo, this));
	this.$("#validateAddress").change($.proxy(this.validateAddress, this)); //had to use validate address because 3 ids are required underneath it
	this.$("#province").change($.proxy(this.validateProvince, this));
	},
	
	//Validate URL
	validateUrl: function(){   
	//Remove any appended error messages
	this.$("#addForm #errorURL").remove();
	this.$("#validateURL").removeClass("redClass");
	//URL REGEX
	if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(document.getElementById("url").value.trim())
	&& document.getElementById("url").value != ""){
		//Create red error message
		this.$("#validateURL").append("<span class='help-inline' id='errorURL'>Invalid Url</span>");
		this.$("#validateURL").addClass("redClass");
		console.log("error");
		return false;
	};
	return true;
    },
	
	//Validate dishName
	validateName: function(){        
	this.$("#addForm #errorDishName").remove();
	this.$("#validateDishName").removeClass("redClass");
	if (!/\w/.test(document.getElementById("dishName").value.trim())){
			this.$("#validateDishName").append("<span class='help-inline' id='errorDishName'>Invalid Name</span>");
			this.$("#validateDishName").addClass("redClass");
			console.log("error");
			return false;
		};
	return true;
    },
	
	//Validate address - number, street, city
	validateAddress: function(){        
	this.$("#addForm #errorAddress").remove();
	this.$("#validateAddress").removeClass("redClass");
	if (!/^[0-9]+[a-zA-Z]*$/.test(document.getElementById("streetNumber").value.trim())){
			this.$("#validateAddress").append("<span class='help-inline' id='errorAddress'>Invalid Address Number</span>");
			this.$("#validateAddress").addClass("redClass");
			console.log("error");
			return false;
		};
	if (!/^([a-zA-Z]\s*)+$/.test(document.getElementById("streetName").value.trim())){
			this.$("#validateAddress").append("<span class='help-inline' id='errorAddress'>Invalid Street Name</span>");
			this.$("#validateAddress").addClass("redClass");
			console.log("error");
			return false;
		};
		
	if (!/^([a-zA-Z]\s*)+$/.test(document.getElementById("city").value.trim())){
			this.$("#validateAddress").append("<span class='help-inline' id='errorAddress'>Invalid City</span>");
			this.$("#validateAddress").addClass("redClass");
			console.log("error");
			return false;
		};
	return true;
    },
	
	//Validate Venue
	validateVenue: function(){    
	this.$("#addForm #errorVenue").remove();
	this.$("#validateVenue").removeClass("redClass");
		if (!/\w/.test(document.getElementById("venue").value.trim())){
		this.$("#validateVenue").append("<span class='help-inline' id='errorVenue'>Invalid venue</span>");
		this.$("#validateVenue").addClass("redClass");
		console.log("error");
		return false;
	};
	return true;
    },
	
	//Validate Info
	validateInfo: function(){    
	this.$("#addForm #errorInfo").remove();
	this.$("#validateInfo").removeClass("redClass");
		if (!/^([a-zA-Z0-9]\s*)+$/.test(document.getElementById("info").value.trim())){
		this.$("#validateInfo").append("<span class='help-inline' id='errorInfo'>Invalid Information</span>");
		this.$("#validateInfo").addClass("redClass");
		console.log("error");
		return false;
	};
	return true;
    },
	
	//Validate Province
	validateProvince: function(){    
	this.$("#addForm #errorProvince").remove();
	this.$("#validateProvince").removeClass("redClass");
		if (!/\w/.test(document.getElementById("province").value.trim())){
		this.$("#validateProvince").append("<span class='help-inline' id='errorProvince'>Invalid Province</span>");
		this.$("#validateProvince").addClass("redClass");
		console.log("error");
		return false;
	};
	return true;
    }
		
});

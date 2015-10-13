var eatz =  eatz || {};

//Dish Model
eatz.Dish = Backbone.Model.extend({
	
	idAttribute: "_id",
	
	defaults: {

			name: "",  // dish name, which will headline it's display in browse view
			venue:"",  // establishment where the dish was prepared/sampled/ordered
			info: "TBA",   // string of descriptive terms, such as: takeout, burgers, etc
			numbr: "1265",  // venue's street-address number - defaults to "1265"
			street: "Military Trail",  // venue's street name - defaults to "Military Trail"
			city: "Scarborough",   // venue's city name - defaults to "Scarborough"
			province: "ON",  // venue's 2-letter province abbreviation - defaults to ON
			url: "",  // venue's Web-page address
			lat: 43.784925,
			lon: -79.185323,
			image: "img/default.png"
		 
	},
	  

});

var eatz =  eatz || {};

//Map Model
eatz.Map = Backbone.Model.extend({
	
	defaults: {
			zoom: 16,
			center: new google.maps.LatLng(43.784925, -79.185323),
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}
});
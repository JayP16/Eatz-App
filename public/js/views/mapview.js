var eatz =  eatz || {};

// note View-name (HomeView) matches name of template HomeView.html
eatz.MapView = Backbone.View.extend({

    initialize: function() {
            this.render();
        },

	render: function() {
		console.log(this.el);
		
		this.map = new google.maps.Map(this.el, this.model.toJSON());
		
		google.maps.event.trigger(this.map, 'resize');
		this.resize();
		 this.marker = new google.maps.Marker({
                    map: this.map,
                    position: this.model.get("center")
                });
		return this;
	},
	
	resize: function(){
		google.maps.event.trigger(this.map, 'resize');
	},
	
	setCenter: function(lat,lon){
		this.map = new google.maps.Map(this.el, this.model.toJSON());
	},
	
	
});
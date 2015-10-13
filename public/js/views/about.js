var eatz =  eatz || {};
eatz.AboutView = Backbone.View.extend({

	//Initialize About View
    initialize: function () {
	this.render();
    },

	//Render About View from template
    render: function () {
		this.$el.html(this.template());  // create DOM content for AboutView
		return this;    // support chaining
    }

});

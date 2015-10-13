var eatz =  eatz || {};
//Create Dish View
eatz.DishView = Backbone.View.extend({
    initialize: function () {
	
	this.render();
    },

    render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;    // support chaining
    }

});
var eatz =  eatz || {};

//DishList collection
eatz.DishList = Backbone.Collection.extend({

	model: eatz.Dish,

});
//Initialize a dish collection to be used for the app
eatz.DishCollection = new eatz.DishList();


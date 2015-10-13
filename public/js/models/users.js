var eatz =  eatz || {};

//DishList collection
eatz.Users = Backbone.Collection.extend({

	model: eatz.User,
	url: '/auth'
});
//Initialize a dish collection to be used for the app
eatz.UserCollection = new eatz.Users();
//Fetch localstorage's models and add to collection
eatz.UserCollection.fetch();

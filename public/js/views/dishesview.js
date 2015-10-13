var eatz =  eatz || {};

//Dishes View AKA Browse View
eatz.DishesView = Backbone.View.extend({
	
    initialize: function () {
		eatz.pubSub.bind('eventName', this.render, this);
		//this.listenTo(this.pubSub,"eventName",this.render,this);
		//this.render();
		//eatz.utils.controlPanel.events.on("sort", this.render());
    },
	
    render: function () {	
		var sortType = $('#sortForm input[type="radio"]:checked:first').val();
		eatz.DishCollection.reset();
		console.log("RENDER DISHES - " + sortType);
		this.$el.html("<h1></h1>"); //Placeholder
		//Use a global myhtml variable to dynamically create bootstrap rows and columns
		myel = this.$el; //create global el so we can do use it in collection loop
		myhtml = "<div id=\"browseContainer\" class=\"container\">";
		 $.getJSON("dishes",function(result){
			var dbCollection = result;
			var tempDish;
			for (var i = 0; i < dbCollection.length; i++)
			{
				tempDish = new eatz.Dish({
					_id : dbCollection[i]._id,
					name : dbCollection[i].name,
					venue : dbCollection[i].venue,
					info : dbCollection[i].info,
					numbr : dbCollection[i].numbr,
					street : dbCollection[i].street,
					city : dbCollection[i].city,
					province : dbCollection[i].province,
					url : dbCollection[i].url,
					image : dbCollection[i].image
				});
				if (tempDish.get('url') == "")
				{
					tempDish.set('url', 'N/A'); //If it's empty display N/A
				}
				eatz.DishCollection.add(tempDish);
			}
			
			console.log(sortType);
				//SORT IT!!
			eatz.DishCollection.comparator = function( model ) {
			  return model.get( sortType ).toLowerCase();
			}	
			
			var sortedDishCollection = eatz.DishCollection.sort();
			count = 0;
			sortedDishCollection.forEach(function(m) {
				count = count + 1;
				if (count == 1) //create row on first column
				{
					myhtml += "<div class=\"row\">";
				}
				myhtml += "<div class=\"span3\">";
				var newDishView = new eatz.DishView({model: m}); //Create view for model
				//newDishView.render(); // Render model
				myhtml += newDishView.template(newDishView.model.attributes);//Add model html data to myhtml holder
				myhtml += "</div>"; //end span div
				if (count == 3) //end row on 3rd column
				{
					count = 0; 
					myhtml += "</div>";//end row div
				}
			});
				
			myhtml += "</div>"; // end container div
			myel.append(myhtml); //append everything to el
			return this;    // support chaining
		});
		
    }

});

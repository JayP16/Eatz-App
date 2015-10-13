var eatz = eatz || {};
var ControlPanel = function () {
            this.events = _.extend({}, Backbone.Events);
        };
eatz.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
			
            if (eatz[view]) {
                deferreds.push($.get('./tpl/' + view + '.html', function(data) {
                    eatz[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },
	
	uploadFile: function(picFile, m) //pic file we are uploading and dishModel we are saving
	{	
		var img = new FormData();
        img.append('file', picFile);
		var send = {data: img};
        $.ajax({
            url: '/dishes/image',
            type: 'POST',
            data: img,
            contentType: false,
			processData: false, 
        })
        .done(function (newname) {
            console.log(picFile.name + " uploaded successfully");
			console.log(m);
			m(newname);
        })
	},

	// display alert messages
	showNotice: function(alertType, message)
	{
		$("#notification").removeClass();
		$("#notification").addClass("alert " + alertType);
		if (alertType == "alert-danger")
		{
			$("#notification").html("<strong>Error!</strong> " + message);
		}
		else if (alertType == "alert-success")
		{
			$("#notification").html("<strong>Success!</strong> " + message);
		}
		else if (alertType == "alert-info")
		{
			$("#notification").html("<strong>Warning:</strong> " + message);
		}
		else
		{
			console.log("ERROR: Show Notice - utils.js");
		}
		$("#notification").show();
	},
	
	
	hideNotice: function()
	{
		$("#notification").hide();
	}

};

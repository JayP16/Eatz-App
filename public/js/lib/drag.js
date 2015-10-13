		// for the drag and drop
		var acceptedTypes = {
		  'image/png': true,
		  'image/jpeg': true,
		  'image/gif': true
		}


function previewfile(file,tests) {
	console.log(file.name);
  if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.src = event.target.result;
	  image.id  = "image-upload";
	  holder.innerHTML = "";
      holder.appendChild(image);
    };

    reader.readAsDataURL(file);
  }  else {
    console.log(file);
  }
}

function readfiles(files,tests) {
    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
      if (tests.formdata) formData.append('file', files[i]);
      previewfile(files[i],tests);
    }

   
}


$(document).ready(function() {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBGTvwF0GbfjWSNWjqtSduaTSaMj8w0nVk",
		authDomain: "mol-xr.firebaseapp.com",
		databaseURL: "https://mol-xr.firebaseio.com",
		projectId: "mol-xr",
		storageBucket: "mol-xr.appspot.com",
		messagingSenderId: "68002697682"
	};
	firebase.initializeApp(config);

	// initialize database & storage references
	var database = firebase.database();
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var user_info = false;

	// handle signin by adding click function to the button
	$("button#signin").click( (event) => {
		console.log("signing in...");
		event.preventDefault();

		// setup a new auth provider object
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.setCustomParameters({
			prompt: 'select_account'
		});

		// authenticate
		firebase.auth().signInWithPopup(provider).then( (result) => {}).catch( (error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

			// The email of the user's account used.
			var email = error.email;

			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;

			console.log(error);
		}); 
	});

	// handle signout by adding click function to the button
	$("button#signout").click( (event) => {
		console.log("signing out...");
		event.preventDefault();

		// sign the user out
		firebase.auth().signOut().then( () => {
			// clear user info
			user_info = false;
		}).catch(function (error) {
			// An error happened.
		});
	});

	// check if the authentication state has changed
	firebase.auth().onAuthStateChanged( (user) => {
		if (user) {
			user_info = user;

			console.log("signed in");
			// console.log("user:");
			// console.log(user_info);

			// show & hide the relevant information
			$("button#signin").hide();
			$("button#signout").show();
			$("#page-welcome").hide();
			$("#page-main").show();

			$("#user_name").html(user_info.displayName);
		} else {
			user_info = false;

			// show & hide the relevant information
			$("button#signin").show();
			$("button#signout").hide();
			$("#page-welcome").show();
			$("#page-main").hide();

			console.log("signed out");
		}
	});

	var fileContents;

	// When file is uploaded, check for the file type
	$("#molUpload").change( () => {
		var uploadFile = document.getElementById("molUpload").files[0];
		// check if the file is a .mol
		if (uploadFile.name.substring(uploadFile.name.length - 4) == ".mol") {
			$("#molUploadLabel").html(uploadFile.name); // hange the file uploader to include the file name
			document.getElementById("molUploadButton").disabled = false; // take the "disabled" property off of the upload button
			$(".modal-body small").hide();

			var reader = new FileReader();
			reader.readAsText(uploadFile, "UTF-8");

			reader.onload = function (event) {
				//console.log(event.target.result);
				fileContents = event.target.result;
			}
		} else {
			$(".modal-body small").show();
			$("#molUploadLabel").html("Choose a .mol file");
			document.getElementById("molUpload").value = null; // clear the field
			document.getElementById("molUploadButton").disabled = true; // make sure the file cannot be uploaded
		}
	});

	// handle upload button click
	$("#molUploadButton").click( () => {
		var uploadFile = document.getElementById("molUpload").files[0];

		var molecule = {
			name: uploadFile.name,
			data: fileContents
		};
		//console.log(fileContents);
		
		if (user_info) {
			// upload the data
			var newKey = database.ref().child('molecules').push().key;

			var update = {};
			update["users/"+user_info.uid+"/molecules/"+newKey] = molecule;
			database.ref().update(update);
			console.log("success!");

			// clear the modal input field
			document.getElementById("molUpload").value = null; // clear the field
			document.getElementById("molUploadButton").disabled = true; // make sure the file cannot be uploaded
			$("#molUploadLabel").html("Choose a .mol file");
			$('#upload-modal').modal('toggle') // toggle the modal to close
		}

	});
});
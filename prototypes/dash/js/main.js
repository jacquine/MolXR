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

});
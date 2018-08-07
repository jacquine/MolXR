var GLmolLoader;
var molecule;
var data;
var rotationSpeed = 0.3; //this is the STARTING speed multiplier for the molecule

function setup() {
	
	noCanvas();

}

function draw() {
	if (molecule) {
		molecule.rotation.y += (rotationSpeed*0.0085); //multiply the speed rate by 0.0085, to prevent excessive spinning
	}
}

$(document).ready(function() {
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

	function $_GET(param) {
		var vars = {};
		window.location.href.replace(location.hash, '').replace(
			/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
			function (m, key, value) { // callback
				vars[key] = value !== undefined ? value : '';
			}
		);

		if (param) {
			return vars[param] ? vars[param] : null;
		}
		return vars;
	}

	console.log(`molID: ${$_GET("mol")}`);
	var data = database.ref(`molecules/${$_GET("mol")}`).once("value", (snapshot) => {
		data = snapshot.child("data").val();
		$("title").html(`VR - ${snapshot.child("name").val()}`);

		//GLmolLoader is our actual GLmol instance, created using the raw data from firebase
		GLmolLoader = new GLmol(data);
		renderScene("#VRScene", "ball-stick"); //render the scene using ball & stick as the default view
	});

	//this is a method which can be called to re-build the scene. it changes the representation and then moves the "new" molecule into the correct position
	renderScene = function(target, rep) {
		GLmolLoader.buildScene(target, rep);
		molecule = GLmolLoader.rotationGroup;
		molecule.position.z = -10;
		molecule.position.y = 1;
	}
});
var GLmolLoader;
var molecule;
var data;
var rotationSpeed = 0.3;

function setup() {
	
	noCanvas();

}

function draw() {
	if (molecule) {
		molecule.rotation.y += (rotationSpeed*0.0085);
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

		GLmolLoader = new GLmol(data);
		renderScene("#VRScene", "ball-stick");
	});

	renderScene = function(target, rep) {
		GLmolLoader.buildScene(target, rep);
		molecule = GLmolLoader.rotationGroup;
		molecule.position.z = -10;
		molecule.position.y = 1;
	}
});
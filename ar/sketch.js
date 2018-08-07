var threeSceneReference;
var GLmolLoader;
var molecule;
var rotationSpeed = 0.3; //this is the STARTING speed multiplier for the molecule

function setup() {
	
	noCanvas();

}

function draw() {
	if (molecule) {
		molecule.rotation.z += (rotationSpeed * 0.0085); //multiply the speed rate by 0.0085, to prevent excessive spinning
	}
}

$(document).ready(function() {
	console.log("AR sketch.js ready");

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
		var data = snapshot.child("data").val();
		$("title").html(`AR - ${snapshot.child("name").val()}`);

		//GLmolLoader will be our GLmol instance, created using the data from firebase
		GLmolLoader = new GLmol(data);
		renderScene("a-marker", "ball-stick");
		
	});

	//this is a method which can be called to re-build the scene. it changes the representation and then moves the "new" molecule into the correct position
	renderScene = function (target, rep) {
		GLmolLoader.buildScene(target, rep);
		threeSceneReference = GLmolLoader.scene;
		molecule = GLmolLoader.rotationGroup;
		molecule.scale.set(0.15, 0.15, 0.15);
		molecule.position.set(0, 0.6, 0);
		molecule.rotation.set(3.14 / 2, 0, 0);

		var geo = new THREE.PlaneGeometry(1.25, 1.25, 1.25);
		var mat = new THREE.MeshBasicMaterial({
			color: 0x000000,
			side: THREE.DoubleSide,
			opacity: 0.9
		});
		var plane = new THREE.Mesh(geo, mat);
		plane.rotateX(-Math.PI / 2);

		threeSceneReference.add(plane);
	}
});
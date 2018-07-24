var loader;

var threeSceneReference;

var molecule;

function setup() {

	threeSceneReference = document.querySelector('a-marker').object3D;

	loader = new THREE.MOLLoader();
	// loader.load("models/molecule.mol", (model) => {
	// 	threeSceneReference.add(model);
	// });

	var geo = new THREE.PlaneGeometry(1.25, 1.25, 1.25);
	var mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, opacity: 0.9});
	var plane = new THREE.Mesh(geo, mat);
	plane.rotateX(- Math.PI / 2);

	threeSceneReference.add(plane);
}

function draw() {
	if (molecule) {
		// molecule.rotation.x += 0.002;
		// molecule.rotation.y += 0.003;
		molecule.rotation.z += 0.0035;
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

		loader.load(data, (model) => {
			molecule = model;
			// rescale and offset the model
			molecule.scale.set(0.0018, 0.0018, 0.0018);
			molecule.position.set(0, 0.6, 0);
			molecule.rotation.set(3.14 / 2, 0, 0);
			// add to the marker
			threeSceneReference.add(molecule);
		});
	});
});
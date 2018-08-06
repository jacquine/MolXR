var threeSceneReference;
var GLmolLoader;
var molecule;

function setup() {

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

		GLmolLoader = new GLmol(data);
		GLmolLoader.buildScene("a-marker");
		threeSceneReference = GLmolLoader.scene;
		molecule = GLmolLoader.rotationGroup;
		molecule.scale.set(0.1,0.1,0.1);
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
	});
});
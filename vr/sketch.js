var world;

var loader;

var threeSceneReference;

function setup() {
	
	noCanvas();

	world = new World('VRScene');

	threeSceneReference = document.querySelector('a-scene').object3D;

	loader = new THREE.MOLLoader();
	// loader.load("models/molecule.mol", (model) => {
	// 	threeSceneReference.add(model);
	// });
}

function draw() {

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
		var data = snapshot.child("data").val();

		loader.load(data, (model) => {
			threeSceneReference.add(model);
		});
	});
});
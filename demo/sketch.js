var loader;
var rotationSpeed = 0.00225;

var oxycontinMarker;
var caffeineMarker;
var hydrocortisoneMarker;

var oxycontinMol;
var caffeineMol;
var hydrocortisoneMol;

var molecule;

function setup() {

}

function draw() {
	if (oxycontinMol) {
		oxycontinMol.rotation.z += rotationSpeed;
	}
	if (caffeineMol) {
		caffeineMol.rotation.z += rotationSpeed;
	}
	if (hydrocortisoneMol) {
		hydrocortisoneMol.rotation.z += rotationSpeed;
	}
}

$(document).ready(function() {
	
	// get/create the markers for each molecule
	oxycontinMarker = document.querySelector('#oxycontin-marker').object3D;
	caffeineMarker = document.querySelector('#caffeine-marker').object3D;
	hydrocortisoneMarker = document.querySelector('#hydrocortisone-marker').object3D;

	loader = new THREE.MOLLoader();
	// loader.load("models/molecule.mol", (model) => {
	// 	threeSceneReference.add(model);
	// });

	//create a plane to add to each marker
	var geo = new THREE.PlaneGeometry(1.25, 1.25, 1.25);
	var mat = new THREE.MeshBasicMaterial({
		color: 0x000000,
		side: THREE.DoubleSide,
		opacity: 0.9
	});
	var plane = new THREE.Mesh(geo, mat);
	plane.rotateX(-Math.PI / 2);

	//add the plane to each marker (note the glitchy multiple-plane thing)
	oxycontinMarker.add(plane);
	var plane = new THREE.Mesh(geo, mat);
	plane.rotateX(-Math.PI / 2);
	caffeineMarker.add(plane);
	var plane = new THREE.Mesh(geo, mat);
	plane.rotateX(-Math.PI / 2);
	hydrocortisoneMarker.add(plane);

	//load oxycontin
	$.get("models/Oxycontin.mol", function(data) {
		loader.load(data, (model) => {
			oxycontinMol = model;
			// rescale and offset the model
			oxycontinMol.scale.set(0.0018, 0.0018, 0.0018);
			oxycontinMol.position.set(0, 0.6, 0);
			oxycontinMol.rotation.set(Math.PI / 2, 0, 0);
			// add to the marker
			oxycontinMarker.add(oxycontinMol);
		});
	}, "text");

	//load caffeine
	$.get("models/Caffeine.mol", function (data) {
		loader.load(data, (model) => {
			caffeineMol = model;
			// rescale and offset the model
			caffeineMol.scale.set(0.0018, 0.0018, 0.0018);
			caffeineMol.position.set(0, 0.6, 0);
			caffeineMol.rotation.set(Math.PI / 2, 0, 0);
			// add to the marker
			caffeineMarker.add(caffeineMol);
		});
	}, "text");

	//load hydrocortisone
	$.get("models/Hydrocortisone.mol", function (data) {
		loader.load(data, (model) => {
			hydrocortisoneMol = model;
			// rescale and offset the model
			hydrocortisoneMol.scale.set(0.0018, 0.0018, 0.0018);
			hydrocortisoneMol.position.set(0, 0.6, 0);
			hydrocortisoneMol.rotation.set(Math.PI / 2, 0, 0);
			// add to the marker
			hydrocortisoneMarker.add(hydrocortisoneMol);
		});
	}, "text");
	
});
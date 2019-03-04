var rotationSpeed = 0.3;
var rotationRatio = 0.02;

function setup() {
  // for each molecule in the molecules array (the array of names built at the top of this file), build out the molecules model onto its individual marker
  $.each(molecules, (i, mol) => {
    //console.log(mol);

    $('a-scene').append(
      `<a-marker id="${mol.name}_marker" preset="custom" url="markers/${
        mol.name
      }.patt"></a-marker>`
    ); // append the a-marker to the a-scene with the appropriate pattern/ID

    mol.marker = document.getElementById(`${mol.name}_marker`);
    mol.viewCount = 0;
    mol.seen = false;

    /* 
		/* 
    /* 
		// get the .mol model data
		$.get(`models/${mol.name}.mol`, (data) => {
			mol.glmol = new GLmol(data); // create a glmol object WITHIN the molecule object

			renderScene(mol, "ball-stick"); // render the scene, passing the molecule object as well as the desired representation
		}); */
  });

  // this is a method which can be called to re-build the scene. it changes the representation and then moves the "new" molecule into the correct position
  // this method has been adapted from the normal AR renderScene function, but it uses the molecule object passed into it instead of the scene reference ID
  // it works the same way, but stores the marker scene, model, and plane as parameters of the molecule object (in the molecule array)
  renderScene = function(mol, rep) {
    mol.glmol.buildScene(`#${mol.name}_marker`, rep);
    mol.marker = mol.glmol.scene;
    mol.model = mol.glmol.rotationGroup;
    mol.model.scale.set(0.15, 0.15, 0.15);
    mol.model.position.set(0, 0.6, 0);
    mol.model.rotation.set(3.14 / 2, 0, 0);

    var geo = new THREE.PlaneGeometry(1.25, 1.25, 1.25);
    var mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 0.9,
    });
    mol.plane = new THREE.Mesh(geo, mat);
    mol.plane.rotateX(-Math.PI / 2);

    mol.marker.add(mol.plane);
  };

  requestAnimationFrame(draw);
}

function draw() {
  // iterate through each molecule and if the model has been built already, rotate the molecule by the specified amount
  $.each(molecules, (i, mol) => {
    // console.log(mol);
    // if the marker hasn't been seen yet, then load the molecule
    if (mol.marker.object3D && mol.marker.object3D.visible && !mol.seen) {
      // use the viewCount to make sure the marker is consistantly viewed for 10 frames
      if (mol.viewCount < 10) {
        mol.viewCount++;
        // console.log(mol.viewCount);
      } else {
        mol.seen = true;
        console.log(`lazy-loading molecule ${mol.name}.mol`);
        $.get(`models/${mol.name}.mol`, (data) => {
          mol.glmol = new GLmol(data); // create a glmol object WITHIN the molecule object

          renderScene(mol, 'ball-stick'); // render the scene, passing the molecule object as well as the desired representation
        });
      }
    }

    // if the model exists
    if (mol.model) {
      mol.model.rotation.z += rotationSpeed * rotationRatio;
    }
  });

  requestAnimationFrame(draw);
}

$(document).ready(setup);

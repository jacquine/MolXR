/**
 * @author Jason Lee 676574039@qq.com
 *
 */

// Originally from:
// https://github.com/ljt1469/threejs/blob/master/MolLoader.js



THREE.MOLLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MOLLoader.prototype = {

	constructor: THREE.PDBLoader,

	load: function ( text, onLoad, onProgress, onError ) {

		var scope = this;

		var json = scope.parseMOL( text );

		//use this "model" variable to store the THREEjs model and pass it into the onLoad function (probably to add to the AFrame world)
		var model = scope.createModel( json );
		onLoad(model);
	},

	// Based on CanvasMol PDB parser

	parseMOL: function ( text ) {

		function trim( text ) {

			return text.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );

		}

		function capitalize( text ) {

			return text.charAt( 0 ).toUpperCase() + text.substr( 1 ).toLowerCase();

		}

		function parseBond( start, length ) {

			var eatom = parseInt( lines[ i ].substr( start, length ) );

			if ( eatom ) {

				var h = hash( satom, eatom );

				if ( bhash[ h ] === undefined ) {

					bonds.push( [ satom - 1, eatom - 1, 1 ] );
					bhash[ h ] = bonds.length - 1;

				} else {

					// doesn't really work as almost all PDBs
					// have just normal bonds appearing multiple
					// times instead of being double/triple bonds
					// bonds[bhash[h]][2] += 1;

				}

			}

		}

		var CPK = { "h": [ 255, 255, 255 ], "he": [ 217, 255, 255 ], "li": [ 204, 128, 255 ], "be": [ 194, 255, 0 ], "b": [ 255, 181, 181 ], "c": [ 144, 144, 144 ], "n": [ 48, 80, 248 ], "o": [ 255, 13, 13 ], "f": [ 144, 224, 80 ], "ne": [ 179, 227, 245 ], "na": [ 171, 92, 242 ], "mg": [ 138, 255, 0 ], "al": [ 191, 166, 166 ], "si": [ 240, 200, 160 ], "p": [ 255, 128, 0 ], "s": [ 255, 255, 48 ], "cl": [ 31, 240, 31 ], "ar": [ 128, 209, 227 ], "k": [ 143, 64, 212 ], "ca": [ 61, 255, 0 ], "sc": [ 230, 230, 230 ], "ti": [ 191, 194, 199 ], "v": [ 166, 166, 171 ], "cr": [ 138, 153, 199 ], "mn": [ 156, 122, 199 ], "fe": [ 224, 102, 51 ], "co": [ 240, 144, 160 ], "ni": [ 80, 208, 80 ], "cu": [ 200, 128, 51 ], "zn": [ 125, 128, 176 ], "ga": [ 194, 143, 143 ], "ge": [ 102, 143, 143 ], "as": [ 189, 128, 227 ], "se": [ 255, 161, 0 ], "br": [ 166, 41, 41 ], "kr": [ 92, 184, 209 ], "rb": [ 112, 46, 176 ], "sr": [ 0, 255, 0 ], "y": [ 148, 255, 255 ], "zr": [ 148, 224, 224 ], "nb": [ 115, 194, 201 ], "mo": [ 84, 181, 181 ], "tc": [ 59, 158, 158 ], "ru": [ 36, 143, 143 ], "rh": [ 10, 125, 140 ], "pd": [ 0, 105, 133 ], "ag": [ 192, 192, 192 ], "cd": [ 255, 217, 143 ], "in": [ 166, 117, 115 ], "sn": [ 102, 128, 128 ], "sb": [ 158, 99, 181 ], "te": [ 212, 122, 0 ], "i": [ 148, 0, 148 ], "xe": [ 66, 158, 176 ], "cs": [ 87, 23, 143 ], "ba": [ 0, 201, 0 ], "la": [ 112, 212, 255 ], "ce": [ 255, 255, 199 ], "pr": [ 217, 255, 199 ], "nd": [ 199, 255, 199 ], "pm": [ 163, 255, 199 ], "sm": [ 143, 255, 199 ], "eu": [ 97, 255, 199 ], "gd": [ 69, 255, 199 ], "tb": [ 48, 255, 199 ], "dy": [ 31, 255, 199 ], "ho": [ 0, 255, 156 ], "er": [ 0, 230, 117 ], "tm": [ 0, 212, 82 ], "yb": [ 0, 191, 56 ], "lu": [ 0, 171, 36 ], "hf": [ 77, 194, 255 ], "ta": [ 77, 166, 255 ], "w": [ 33, 148, 214 ], "re": [ 38, 125, 171 ], "os": [ 38, 102, 150 ], "ir": [ 23, 84, 135 ], "pt": [ 208, 208, 224 ], "au": [ 255, 209, 35 ], "hg": [ 184, 184, 208 ], "tl": [ 166, 84, 77 ], "pb": [ 87, 89, 97 ], "bi": [ 158, 79, 181 ], "po": [ 171, 92, 0 ], "at": [ 117, 79, 69 ], "rn": [ 66, 130, 150 ], "fr": [ 66, 0, 102 ], "ra": [ 0, 125, 0 ], "ac": [ 112, 171, 250 ], "th": [ 0, 186, 255 ], "pa": [ 0, 161, 255 ], "u": [ 0, 143, 255 ], "np": [ 0, 128, 255 ], "pu": [ 0, 107, 255 ], "am": [ 84, 92, 242 ], "cm": [ 120, 92, 227 ], "bk": [ 138, 79, 227 ], "cf": [ 161, 54, 212 ], "es": [ 179, 31, 212 ], "fm": [ 179, 31, 186 ], "md": [ 179, 13, 166 ], "no": [ 189, 13, 135 ], "lr": [ 199, 0, 102 ], "rf": [ 204, 0, 89 ], "db": [ 209, 0, 79 ], "sg": [ 217, 0, 69 ], "bh": [ 224, 0, 56 ], "hs": [ 230, 0, 46 ], "mt": [ 235, 0, 38 ],
			   "ds": [ 235, 0, 38 ], "rg": [ 235, 0, 38 ], "cn": [ 235, 0, 38 ], "uut": [ 235, 0, 38 ], "uuq": [ 235, 0, 38 ], "uup": [ 235, 0, 38 ], "uuh": [ 235, 0, 38 ], "uus": [ 235, 0, 38 ], "uuo": [ 235, 0, 38 ] };


		var atoms = [];
		var bonds = [];
		var histogram = {};
		var atomNum = 0;

		var bhash = {};

		var lines = text.split( "\n" );

		var nums = lines[3].split(" ").filter(Boolean); //this is the easiest way to get the numbers from the counting line

		atomNum = parseFloat( nums[0] ); //modified: read the first number on lines[3] as the number of atoms to read
		
		bondNum = parseFloat( nums[1] ); //to find the number of bonds
		//I created this variable, it was not in the loader as downloaded (Will)

		var x, y, z, e;

		for ( var i = 4, l = lines.length; i < l; ++ i ) {

			if ( (i>=1)&&(i<=atomNum+3) ) { //note: I (Will) modified this line to add "+3" so as not to read the first 3 lines of the file
				//this "if" statement is for atoms
				x = parseFloat( lines[ i ].substr( 3, 7 ) );
				y = parseFloat( lines[ i ].substr( 13, 7 ) );
				z = parseFloat( lines[ i ].substr( 23, 7 ) );

				e = trim( lines[ i ].substr( 31, 2 ) ).toLowerCase();

				atoms.push( [ x, y, z, CPK[ e ], capitalize( e ) ] );

				if ( histogram[ e ] === undefined ) histogram[ e ] = 1;
				else histogram[ e ] += 1;

			} else if ( i>atomNum & i<=3+atomNum+bondNum) { //note: I (Will) modified this line to read the correct number of bonds
				//this "else-if" statement is for bonds
				var satom = parseInt( lines[ i ].substr( 1, 2 ) );
				var eatom = parseInt( lines[ i ].substr( 4, 2 ) );
				var bondorder = parseInt( lines[ i ].substr( 7, 2 ) );
				bonds.push( [ satom - 1, eatom - 1, bondorder ] );

			}

		}

		return { "ok": true, "atoms": atoms, "bonds": bonds, "histogram": histogram };

	},

	createModel: function ( json ) {

		var geometryAtoms = new THREE.BufferGeometry();
		var geometryBonds = new THREE.BufferGeometry();
		var bondOrder = [];
		var i, l;

		var verticesAtoms = [];
		var colors = [];
		var verticesBonds = [];

		geometryAtoms.elements = [];

		var atoms = json.atoms;
		var bonds = json.bonds;

		for ( i = 0, l = atoms.length; i < l; i ++ ) {

			var atom = atoms[ i ];

			var x = atom[ 0 ];
			var y = atom[ 1 ];
			var z = atom[ 2 ];

			verticesAtoms.push( x, y, z );

			var r = atom[ 3 ][ 0 ] / 255;
			var g = atom[ 3 ][ 1 ] / 255;
			var b = atom[ 3 ][ 2 ] / 255;

			colors.push( r, g, b );

			geometryAtoms.elements.push( atom[ 4 ] );

		}

		for ( i = 0, l = bonds.length; i < l; i ++ ) {

			var bond = bonds[ i ];
			//console.log(bond);

			var start = bond[ 0 ];
			var end = bond[ 1 ];

			verticesBonds.push( verticesAtoms[ ( start * 3 ) + 0 ] );
			verticesBonds.push( verticesAtoms[ ( start * 3 ) + 1 ] );
			verticesBonds.push( verticesAtoms[ ( start * 3 ) + 2 ] );

			verticesBonds.push( verticesAtoms[ ( end * 3 ) + 0 ] );
			verticesBonds.push( verticesAtoms[ ( end * 3 ) + 1 ] );
			verticesBonds.push( verticesAtoms[ ( end * 3 ) + 2 ] );
			bondOrder.push(bond[ 2 ]);
		}

		geometryAtoms.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesAtoms, 3 ) );
		geometryAtoms.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

		geometryBonds.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesBonds, 3 ) );

		return generateGeometry(geometryAtoms, geometryBonds, bondOrder, json);

	}

};

//this function will return an actual THREEjs model to createModel()
//this function is based on the THREEjs PDBloader demo:
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_pdb.html
function generateGeometry(geometryAtoms, geometryBonds, bondOrder, json) {
	//"root" will be the group that stores the entire molecule
	var root = new THREE.Group();

	var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1); //will become bonds
	var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 2); //will become molecules
	var offset = new THREE.Vector3();

	geometryAtoms.computeBoundingBox();
	geometryAtoms.boundingBox.getCenter(offset).negate();

	geometryAtoms.translate(offset.x, offset.y, offset.z);
	geometryBonds.translate(offset.x, offset.y, offset.z);

	var positions = geometryAtoms.getAttribute('position');
	var colors = geometryAtoms.getAttribute('color');

	var position = new THREE.Vector3();
	var color = new THREE.Color();

	for (var i = 0; i < positions.count; i++) {

		position.x = positions.getX(i);
		position.y = positions.getY(i);
		position.z = positions.getZ(i);

		color.r = colors.getX(i);
		color.g = colors.getY(i);
		color.b = colors.getZ(i);

		var material = new THREE.MeshPhongMaterial({ color: color });

		var object = new THREE.Mesh(sphereGeometry, material);
		object.position.copy(position);
		object.position.multiplyScalar(75);
		object.scale.multiplyScalar(25);
		root.add(object);

		//the following lines (commented out) came from the PDB loader demo, but caused errors
		//may come back to use them later
		/*
		var atom = json.atoms[ i ];
		var text = document.createElement( 'div' );
		text.className = 'label';
		text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
		text.textContent = atom[ 4 ];
		var label = new THREE.CSS2DObject( text );
		label.position.copy( object.position );
		root.add( label );
		*/
	}

	positions = geometryBonds.getAttribute('position');

	var start = new THREE.Vector3();
	var end = new THREE.Vector3();

	for (var i = 0; i < positions.count; i += 2) {

		var numberOfBonds = bondOrder[parseInt(i / 2)];
		//console.log("Number of bonds: " + numberOfBonds);

		start.x = positions.getX(i);
		start.y = positions.getY(i);
		start.z = positions.getZ(i);
		end.x = positions.getX(i + 1);
		end.y = positions.getY(i + 1);
		end.z = positions.getZ(i + 1);

		start.multiplyScalar(75);
		end.multiplyScalar(75);

		var g = new THREE.Group();

		for (var j = 1; j <= numberOfBonds; j++) {

			color.r = colors.getX(json.bonds[i / 2][0]); //use the references in the bond json data to find the color of the atom the bond is connected to
			color.g = colors.getY(json.bonds[i / 2][0]);
			color.b = colors.getZ(json.bonds[i / 2][0]);

			var object1 = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({
				color: color
			})); //object1 becomes one half of the bond, inheriting its color from the atom it's attached to at its end

			object1.position.copy(start);
			object1.position.lerp(end, 0.25);
			object1.scale.set(5, 5, start.distanceTo(end) / 2);
			object1.lookAt(end);
			g.add(object1);

			color.r = colors.getX(json.bonds[i / 2][1]);
			color.g = colors.getY(json.bonds[i / 2][1]);
			color.b = colors.getZ(json.bonds[i / 2][1]);

			var object2 = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({
				color: color
			})); //object2 becomes the other half of the bond, inheriting its color  respectively from the atom it's attached to at its end

			object2.position.copy(start);
			object2.position.lerp(end, 0.75);
			object2.scale.set(5, 5, start.distanceTo(end) / 2);
			object2.lookAt(end);
			g.add(object2);

			//translate the bond along its axis to create n>1 order bonds
			object1.translateX(8 * (j * 2 - numberOfBonds - 1));
			object2.translateX(8 * (j * 2 - numberOfBonds - 1));
		}

		//add the collective bonds (eg if it is an order 2 bond, it will contain 2 "newBond" groups, each one representing one bond) to the actual root
		root.add(g);
	}
	root.scale.set(0.01, 0.01, 0.01);
	return root;
}
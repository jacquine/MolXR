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
	var updates;

	var id = $_GET("id");
	console.log(`id: ${id}`);

	var printTable = function(data) {
		//check if the data is not null
		if (data != null) {
			// remove the current table
			$("#page-table").empty();
			// add a BS table to the div
			$("#page-table").append('<table class="table"></table>');
			// add the header to the table
			$("#page-table table").append('<thead class="thead-light"></thead>');
			// add the header cells
			$("#page-table table thead").append('<th scope="col">Molecule</th>');
			$("#page-table table thead").append('<th scope="col" class="text-right">Options</th>');
			// add the body to the table
			$("#page-table table").append('<tbody></tbody>')
			for (var key in data.molecules) {
				// each molecule has its own row in the table, with a unique ID (just in case) for targeting purposes
				$("#page-table table tbody").append(`<tr id="${key}" class="mol-row"></tr>`);
				$(`#${key}`).data("key",key);
				
				// add the name of the molecule as the primary part of the table
				$(`#page-table table tbody #${key}`).append(`<th scope="row" class="align-middle">${data.molecules[key].name}</th>`);

				// everything else, which gets added to the right side of the table, will need to be functional

				// write the table cell
				$(`#page-table table tbody #${key}`).append(`<td class="text-right"></td>`);

				// add link to view in AR
				$(`#page-table table tbody #${key} td`).append(`<a class="mx-2 btn btn-outline-dark" href="../ar?mol=${key}" role="button">AR</a>`);

				// add link to view in VR
				$(`#page-table table tbody #${key} td`).append(`<a class="ml-2 btn btn-outline-dark" href="../vr?mol=${key}" role="button">VR</a>`);
			}
		} else {
			$("#page-table").empty();
		}
	};

	// this chunk of code checks for updates and prints the table
	updates = database.ref("/users/"+id);
	updates.on("value", (snapshot) => {
		var data = snapshot.val()
		printTable(data);
	});

	//define function to get query string parameters
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
});
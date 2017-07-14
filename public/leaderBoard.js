var table = '';
var rows = 10;
var cols = 3;

var ref = database.ref('/team');
fetchData();

function fetchData() {
	ref.limitToFirst(5).once('value', function(snapshot) {		
		snapshot.forEach(function(childSnapshot) {			
			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();
			table +='<tr>';
			table += '<td>' + childKey + '</td>';
			table +='</tr>';
		});
		
		document.getElementById('leaderBoard').innerHTML = '<table>' + table + '</table>';
	});
	
}

function createTable(data) {
	for (var element in data) {
		console.log(element);
		for (var prop in element) {
			console.log(prop);
		}	
	}

console.log(data);

	fields.forEach(function(element) {
		table +='<tr>';
		for (var i = 0; i < 2; i++) {
			table += '<td>' + element + '</td>';
		}
		table +='</tr>';
	});
	document.write('<table>' + table + '</table>');
}

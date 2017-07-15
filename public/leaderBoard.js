var table = '';

var ref = database.ref('/team');
fetchData();

function fetchData() {
	ref.limitToFirst(5).once('value', function(snapshot) {		
		snapshot.forEach(function(childSnapshot) {			
			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();
			table +='<tr>';
			table += '<td style="padding-left:20px">' + childKey + '</td>' + '<td>' + childData + '</td>';
			table +='</tr>';
		});

		var tbody = document.getElementById('leaderbody');
		var tempNode = tbody.ownerDocument.createElement('div');
		tempNode.innerHTML = "<table class=\"highlight\">" + table + '</table>';
		tbody.parentNode.replaceChild(tempNode.firstChild.firstChild, tbody);

		//document.getElementById("leaderboard").innerHtml = '<tbody>' + table + '</tbody>';
	});

}

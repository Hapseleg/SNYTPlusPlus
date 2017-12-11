$(document).ready(function() {
	let now = new Date();
	let dayNow = ('0' + now.getDate()).slice(-2);
	let monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
	let today = now.getFullYear() + '-' + (monthNow) + '-' + (dayNow);
	$('#advDateTo').val(today);

	let before = new Date();
	before.setMonth(before.getMonth() - 2);
	let dayBefore = ('0' + before.getDate()).slice(-2);
	let monthBefore = ('0' + (before.getMonth() + 1)).slice(-2);
	let dateBefore = before.getFullYear() + '-' + (monthBefore) + '-' + (dayBefore);
	$('#advDateFrom').val(dateBefore);

	$('#advancedSearch').on('keyup keypress', function(e) {
		let keyCode = e.keyCode || e.which;
		if(keyCode === 13) {
			e.preventDefault();
		}
	});

	if(location.pathname == '/') {
		advancedSearch();
	}

	// Bind enter til søgefunktion
	$(document).keypress(function(e) {
		if(e.which == 13) {
			if($('#regularSearchText').is(':focus')) {
				$('#search').click();
			}
			else if($('#advancedSearch').is(':visible')) {
				$('#searchAdv').click();
			}
		}
	});

});

function regularSearch() {
	let searchText = $('#regularSearchText').val();
	if(searchText.length > 1) {
		searchText = '/' + searchText;
	}
	else {
		searchText = '';
	}

	window.location = '/search' + searchText;
}

function advancedSearch() {
	$('#advSearch').submit();
	$('#advancedSearch').modal('hide');
}

function gotoSnyt(row) {
	let id = $(row).data('href');
	window.location.href = '/snyt/' + id;
}

function gotoSnytKvit(row) {
	let id = $(row).data('href');
	window.location.href = '/kvit/' + id;
}

function goBack() {
	window.history.back();
}

//admin CRUD
function findUser(caller) {
	let user = $(caller).find('a').data('user');
	$('#editModal').find('#first').val(user.first);
	$('#editModal').find('#last').val(user.last);
	$('#editModal').find('#initials').val(user.initials);
	$('#editModal').find('#email').val(user.email);
	$('#editModal').find('#password').val(user.password);
	$('#editModal').find('#id').val(user._id);
	return user;
}

function createUser() {

	let fornavn = $('#fornavn').val();
	let efternavn = $('#efternavn').val();
	let initialer = $('#initialer').val();
	let email = $('#email').val();
	let password = $('#password').val();

	// validering

	if(!fornavn.length > 0) {
		alert('Fornavn skal udfyldes');
	}
	else if(!efternavn.length > 0) {
		alert('Efternavn skal udfyldes');
	}
	else if(!initialer.length > 0) {
		alert('Initialer skal udfyldes');
	}
	else if(!email.length > 0) {
		alert('Email skal udfyldes');
	}
	else if(!password.length > 0) {
		alert('Adgangskode skal udfyldes');
	}
	else {
		$.post('/admin',
			{
				user: {
					first: fornavn,
					last: efternavn,
					initials: initialer,
					email: email,
					password: password
				}
			}).done(function() {
			window.location.href = '/admin';
		});
		$('#createModal').modal('hide');

	}
}

function updateUser() {

	let first = $('#editModal').find('#first').val();
	let last = $('#editModal').find('#last').val();
	let initials = $('#editModal').find('#initials').val();
	let email = $('#editModal').find('#email').val();
	let password = $('#editModal').find('#password').val();
	let id = $('#editModal').find('#id').val();

	// validering
	if(!first.length > 0) {
		alert('Fornavn skal udfyldes');
	}
	else if(!last.length > 0) {
		alert('Efternavn skal udfyldes');
	}
	else if(!initials.length > 0) {
		alert('Initialer skal udfyldes');
	}
	else if(!email.length > 0) {
		alert('Email skal udfyldes');
	}
	else if(!password.length > 0) {
		alert('Adgangskode skal udfyldes');
	}
	else {
		$.post('/admin/' + id,
			{
				first: first,
				last: last,
				initials: initials,
				email: email,
				password: password,
				id: id
			}
		).done(() => {
			window.location.href = '/admin';
		});
		$('#editModal').modal('hide');
	}
}

function deleteUser() {
	let id = $('#editModal').find('#id').val();
	$.ajax({
		url: '/admin',
		data: {id: id},
		type: 'DELETE',
		success: function(result) {
			window.location.href = '/admin';
		}
	});

	$('#editModal').modal('hide');
}

//https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n) {
	let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementsByClassName('table');
	switching = true;
	// Set the sorting direction to ascending:
	dir = 'asc';
	/* Make a loop that will continue until
	no switching has been done: */
	while(switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table[0].getElementsByTagName('tr');
		/* Loop through all table rows (except the
		first, which contains table headers): */
		for(i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[i].getElementsByTagName('td')[n];
			y = rows[i + 1].getElementsByTagName('td')[n];
			/* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			if(dir == 'asc') {
				if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			} else if(dir == 'desc') {
				if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
		}
		if(shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			// Each time a switch is done, increase this count by 1:
			switchcount++;
		} else {
			/* If no switching has been done AND the direction is "asc",
			set the direction to "desc" and run the while loop again. */
			if(switchcount == 0 && dir == 'asc') {
				dir = 'desc';
				switching = true;
			}
		}
	}
}


//*******************************************
//used in editsnyt to delete pictures
let toBeDeletedPics = [];
function addPicToDelete(picid) {

    if($('#'+picid).css("border") == "10px solid rgb(255, 0, 0)"){
        $('#'+picid).css("border", "0px solid red");

        for(let i = toBeDeletedPics.length -1; i >= 0; i--) {
            if (toBeDeletedPics[i] == picid) {
                toBeDeletedPics.splice(i, 1);
            }
            toBeDeletedPics.splice()
        }
	}
	else{
        $('#'+picid).css("border", "10px solid red");
        toBeDeletedPics.push(picid)
	}
}

function deletePictures(row) {
    let id = $(row).data("href");
    $.post("/deletePictures",
        {
        	pics: toBeDeletedPics,
			snytid: id
        });
}
//*******************************************
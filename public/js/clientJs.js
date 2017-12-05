$(document).ready(function() {
    var now = new Date();
    var dayNow = ("0" + now.getDate()).slice(-2);
    var monthNow = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(monthNow)+"-"+(dayNow) ;
    $('#advDateTo').val(today);

    var before = new Date();
    before.setMonth(before.getMonth() - 2);
    var dayBefore = ("0" + before.getDate()).slice(-2);
    var monthBefore = ("0" + (before.getMonth() + 1)).slice(-2);
    var dateBefore = before.getFullYear() + "-" + (monthBefore) + "-" + (dayBefore);
    $("#advDateFrom").val(dateBefore);

    $('#advancedSearch').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
        }
    });

    if(location.pathname == "/") {
    	advancedSearch();
	}
	var now = new Date();
	var dayNow = ("0" + now.getDate()).slice(-2);
	var monthNow = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear() + "-" + (monthNow) + "-" + (dayNow);
	$("#advDateTo").val(today);

	var before = new Date();
	before.setMonth(before.getMonth() - 2);
	var dayBefore = ("0" + before.getDate()).slice(-2);
	var monthBefore = ("0" + (before.getMonth() + 1)).slice(-2);
	var dateBefore = before.getFullYear() + "-" + (monthBefore) + "-" + (dayBefore);
	$("#advDateFrom").val(dateBefore);

	$("#advancedSearch").on("keyup keypress", function(e) {
		var keyCode = e.keyCode || e.which;
		if(keyCode === 13) {
			e.preventDefault();
		}
	});

	// Bind enter til søgefunktion
	$(document).keypress(function(e) {
		if(e.which == 13) {
			if($("#regularSearchText").is(":focus")) {
				$("#search").click();
			}
			else if($('#advancedSearch').is(':visible')) {
				console.log("Adv");
				$("#searchAdv").click();
			}
		}
	});

});

function regularSearch() {
	var searchText = $("#regularSearchText").val();
	if(searchText.length > 1) {
		searchText = "/" + searchText;
	}
	else {
		searchText = "";
	}

	window.location = "/search" + searchText;
}

function advancedSearch() {
	$('#advSearch').submit();
    $('#advancedSearch').modal('hide');
}

function gotoSnyt(row) {
	var id = $(row).data("href");
	window.location.href = "/snyt/" + id;
}

function gotoSnytKvit(row) {
	var id = $(row).data("href");
	window.location.href = "/kvit/" + id;
}

function goBack() {
	window.history.back();
}

//admin CRUD
function findUser(caller) {
	var user = $(caller).find("a").data("user");
	$("#editModal").find("#first").val(user.first);
	$("#editModal").find("#last").val(user.last);
	$("#editModal").find("#initials").val(user.initials);
	$("#editModal").find("#email").val(user.email);
	$("#editModal").find("#password").val(user.password);
	$("#editModal").find("#id").val(user._id);
	return user;
}

function createUser() {

	var fornavn = $("#fornavn").val();
	var efternavn = $("#efternavn").val();
	var initialer = $("#initialer").val();
	var email = $("#email").val();
	var password = $("#password").val();

	// validering

	if(!fornavn.length > 0) {
		alert("Fornavn skal udfyldes");
	}
	else if(!efternavn.length > 0) {
		alert("Efternavn skal udfyldes");
	}
	else if(!initialer.length > 0) {
		alert("Initialer skal udfyldes");
	}
	else if(!email.length > 0) {
		alert("Email skal udfyldes");
	}
	else if(!password.length > 0) {
		alert("Adgangskode skal udfyldes");
	}
	else {
		$.post("/admin",
			{
				user: {
					first: fornavn,
					last: efternavn,
					initials: initialer,
					email: email,
					password: password
				}
			});
		$("#createModal").modal("hide");
	}
}

function updateUser() {

	var first = $("#editModal").find("#first").val();
	var last = $("#editModal").find("#last").val();
	var initials = $("#editModal").find("#initials").val();
	var email = $("#editModal").find("#email").val();
	var password = $("#editModal").find("#password").val();
	var id = $("#editModal").find("#id").val();

	// validering
	if(!first.length > 0) {
		alert("Fornavn skal udfyldes");
	}
	else if(!last.length > 0) {
		alert("Efternavn skal udfyldes");
	}
	else if(!initials.length > 0) {
		alert("Initialer skal udfyldes");
	}
	else if(!email.length > 0) {
		alert("Email skal udfyldes");
	}
	else if(!password.length > 0) {
		alert("Adgangskode skal udfyldes");
	}
	else {
		console.log("Starting AJAX request");
		$.post("/admin/" + id,
			{
				first: first,
				last: last,
				initials: initials,
				email: email,
				password: password,
				id: id
			}
		);
		$("#editModal").modal("hide");
	}
}

function deleteUser() {
}

//https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementsByClassName("table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table[0].getElementsByTagName("tr");
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
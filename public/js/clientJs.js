$(document).ready(function() {
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
	var category = $("#advCategory option:selected").val();
	var searchText = $("#advText").val();
	var dateFrom = $("#advDateFrom").val();
	var dateTo = $("#advDateTo").val();
	var read = $("input[name=advRadioButtons]:checked").val();
	$("#advancedSearch").modal("hide");
	$.post("/search",
		{
			text: searchText,
			category: category,
			dateFrom: dateFrom,
			dateTo: dateTo,
			read: read
		});
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
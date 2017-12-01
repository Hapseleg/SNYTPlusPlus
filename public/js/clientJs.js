$(document).ready(function() {
    var pathName = window.location.pathname;
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

    if(pathName == "/") {
        advancedSearch();
    }
    if(pathName == "/kvitoversigt") {
        kvitOversigt();
    }
    console.log(pathName);
    if(pathName == "kvit") {
        getUserDataKvit();
    }
});

function regularSearch() {
    var searchText = $("#regularSearchText").val();
    if(searchText.length > 1) {
        searchText = "/" + searchText;
    }
    var userId = $("#hiddenInput").val();
    $.ajax("/search" + searchText,
        {
            method : "GET",
            success : function(documents) {
                var table = $("#snytOversigt");
                table.empty();
                for(var i in documents) {
                    var subject = documents[i].subject;
                    var date = documents[i].created.toString().substring(0, 10);
                    var initials = documents[i].user;
                    var read = "";
                    if(documents[i].readBy) {
                        if(documents[i].readBy.includes(userId)) {
                            read = "X";
                        } else {
                            read = "";
                        }
                    }
                    table.append("<tr class='clickableRow' data-href=" + documents[i]._id + "><td>" + subject + "</td><td>" + date + "</td><td>" + initials + "</td><td>" + read + "</td></tr>");
                }
                $(".clickableRow").click(function() {
                    window.location = "/snyt/" + $(this).data("href");
                });
                if(window.location.pathname != "/") {
                    window.location = "/";
                }
            }
        }
    );

}

function advancedSearch() {
    var category = $('#advCategory option:selected').val();
    var searchText = $('#advText').val();
    var dateFrom = $('#advDateFrom').val();
    var dateTo = $('#advDateTo').val();
    var read = $('input[name=advRadioButtons]:checked').val();
    $.post('/search',
        {
            text : searchText,
            category : category,
            dateFrom : dateFrom,
            dateTo : dateTo,
            read : read
        }
    ).done(function(documents) {
        var table = $("#snytOversigt");
        var userId = $("#hiddenInput").val();
        table.html("");
        for(var i in documents) {
            var subject = documents[i].subject;
            var date = documents[i].created.toString().substring(0, 10);
            var initials = documents[i].user;
            var read = "//TODO";
            if(documents[i].readBy) {
                if(documents[i].readBy.includes(userId)) {
                    read = "X";
                } else {
                    read = "";
                }
            }
            table.append("<tr class='clickableRow' data-href=" + documents[i]._id + "><td>" + subject + "</td><td>" + date + "</td><td>" + initials + "</td><td>" + read + "</td></tr>");
        }
        $(".clickableRow").click(function() {
            window.location = "/snyt/" + $(this).data("href");
        });
        if(window.location.pathname != "/") {
            window.location = "/";
        }
    });
}

function kvitOversigt() {
    $.ajax("/search",
        {
            method : "GET",
            success : function(documents) {
                var table = $("#snytKvitOversigt");
                table.empty();
                for(var i in documents) {
                    var doc = documents[i];
                    var subject = doc.subject;
                    console.log(doc);
                    var date = doc.created.toString().substring(0, 10);
                    var initials = doc.user;
                    console.log($("#hiddenInputForUserAmount").val());
                    var read = $("#hiddenInputForUserAmount").val() - doc.readBy.length;

                    table.append("<tr class='clickableKvitRow' data-href=" + doc._id + "><td>" + subject + "</td><td>" + date + "</td><td>" + initials + "</td><td>" + read + "</td></tr>");
                }
                $(".clickableKvitRow").click(function() {
                    window.location.href = "/kvit/" + $(this).data("href");
                });
            }
        }
    );
    getUserDataKvit();
}

function getUserDataKvit() {
    console.log($("#kvitListJ").val());
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
};

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
		$.ajax("/admin",
			{
				method: "PUT",
				first: fornavn,
				last: efternavn,
				initials: initialer,
				email: email,
				password: password,
				id: id
			}
		);
	}
}

function deleteUser() {
}

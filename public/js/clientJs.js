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
});

function regularSearch() {
    var searchText = $("#regularSearchText").val();
    if(searchText.length > 1) {
        searchText = "/" + searchText;
    }
    console.log(searchText);
    $.ajax("/search" + searchText,
        {
            method : "GET",
            success : function(documents) {
                for(var i in documents) {
                    console.log(documents[i].subject);
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
    ).done(function(response) {
        console.log(response);
    });
}
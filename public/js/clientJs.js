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
var deleteSuccess = function (response, notification) {
    //console.log(response);
    var $selected_notification = notification.closest(nfClassSelector);
    $selected_notification.fadeOut(300, function () {
        $(this).remove();
        // //update the number of notifications
        // var dom_not_number = $('#notifications-number');
        // dom_not_number.html(dom_not_number.html() - 1);
    });
};
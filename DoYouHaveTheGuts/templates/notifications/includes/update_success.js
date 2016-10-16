var updateSuccess = function (response) {
    var notification_box = $(nfBoxListClassSelector);
    var notifications = response.notifications;
    var notNum = $('#notifications-number');

    // -------- Update the number of notifications when a new notification is displayed in the DOM -----
    // the current number of notifications displayed in the dom
    var current = notNum.html();
    // the number of notifications coming from the server
    var neW = notifications.length;
    notNum.html(neW == 0 ? current : +neW + (+current));
    console.log(notifications);
    $.each(notifications, function (i, notification) {
        notification_box.prepend(notification.html);
    });

};

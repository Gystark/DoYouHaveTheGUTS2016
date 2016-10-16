
$(document).ready(function(){
    $('#news-search').keyup(function(){
        var text = $(this).val();

        $.ajax({
            url: '/auto_complete/',
            type: "GET",
            data: {'search-term': text},
            success: function(data){
                $('#news-holder').html(data);
            }
        });
    });

});
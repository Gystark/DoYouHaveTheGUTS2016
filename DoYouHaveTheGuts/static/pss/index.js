
$(document).ready(function(){

    $('#submit-route-query').click(function(){
        var district = $('#district-dropdown').find(':selected').attr('value');
        var crime = $('#crime-dropdown').find(':selected').attr('value');

        /* Send the ajax request */
        $.ajax({
            url: '/get_map_data/',
            data: {
                'district': district,
                'crime': crime
            },
            success: function(data) {
                var response = $.parseJSON(JSON.stringify(data));
            }
        });
    });

});

var heatmap, map, entries;

/* functions about interacting with the daterange picker */
$(function () {
    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange span').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('#reportrange').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
});

function getDateRangePickerEndDate() {
    /* If there is no range displayed inside the span, this means we want to get
     * all the orders, so simply return undefined in that case
     */
    var span_content = $('#daterange-picker-holder').html();
    if(span_content === ''){
        return undefined;
    }
    return $('#reportrange').data('daterangepicker').endDate.format('YYYY-MM-DDT23:59:59');
}

function getDateRangePickerStartDate(){
    /* If there is no range displayed inside the span, this means we want to get
     * all the orders, so simply return undefined in that case
     */
    var span_content = $('#daterange-picker-holder').html();
    if(span_content === ''){
        return undefined;
    }
    return $('#reportrange').data('daterangepicker').startDate.format('YYYY-MM-DDT00:00:00');
}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('submit-route-query').addEventListener('click', onChangeHandler);
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {

    var points = [];
    for (var i = 0; i < entries.length; i++) {
        points.push(new google.maps.LatLng(entries[i][0], entries[i][1]));
    }

    return points;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var district = $('#district-dropdown').find(':selected').attr('value');
    var crime = $('#crime-dropdown').find(':selected').attr('value');
    var start_date = getDateRangePickerStartDate();
    var end_date = getDateRangePickerEndDate();
    
    $.get(
        '/get_map_data/', 
        {
            'district': district,
            'crime': crime,
            'start_date': start_date,
            'end_date': end_date
        }, 
        function (data) {
            entries = data['heatmap'];
        }).done(function (data) {
            var startpoint = data['origin'];
            var destination = data['destination'];
            var all_waypoints = data['waypoints'];
            var endpoint = destination;
            var waypoints = [];
            var intermitent_route = {};
            var route_colors=["blue", "red", "yellow", "green", "purple"];
            // build the route by constructing smaller routes
            var color_counter = 0;
            for (var i = 0; i < all_waypoints.length; i += 8) {

                // build the waypoints
                var j;
                var loop_stop = (7 > all_waypoints.length - i) ? (all_waypoints.length - i) : 6;
                for (j = i; j < i + loop_stop; j++) {
                    waypoints.push({'location': all_waypoints[j]['location'], 'stopover': false});
                }
                intermitent_route['origin'] = startpoint;
                intermitent_route['destination'] = endpoint;
                intermitent_route['travelMode'] = 'DRIVING';
                intermitent_route['waypoints'] = waypoints;

                if (waypoints.length > 0) {
                    directionsService.route(intermitent_route,
                        function (response, status) {
                            if (status === 'OK') {
                                var customDirectionsDisplay = new google.maps.DirectionsRenderer({
                                    polylineOptions: {
                                        strokeColor: route_colors[color_counter]
                                    }
                                });
                                if (color_counter == 4) {
                                    color_counter = 0;
                                } else {
                                    color_counter++;
                                }
                                customDirectionsDisplay.setMap(map);
                                customDirectionsDisplay.setDirections(response);

                            } else {
                                window.alert("There was something wrong with our data. Please contact support.")
                            }
                        });
                    waypoints = [];
                }
            }
            heatmap = new google.maps.visualization.HeatmapLayer({
                    data: getPoints(),
                    map: map
            });
        });
}
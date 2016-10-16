var heatmap, map, entries;
var heat_on = false;
var year_heat_points = [];
var police_station_markers = [];
var police_stations = [
    [
        'EiUyIEUgR3JhbmQgQXZlLCBDaGljYWdvLCBJTCA2MDYxMSwgVVNB',
        'Grand Central'
    ],
    [
        'ChIJyzbdbbzRD4gRudaLT2YMq3U',
        'Rogers Park'
    ],
    [
        'ChIJYwtQpeQkDogRCMMSHo5AR9g',
        'Morgan Park'
    ],
    [
        'ChIJCZRGtv7RD4gRKsDivi_tElk',
        'Lincoln'
    ],
    [
        'ChIJ5eC7BbHTD4gRbJPRL85Je_M',
        'Town Hall'
    ],
    [
        'ChIJ2R8R1DDTD4gRvnfku2kJXUQ',
        'Near North'
    ],
    [
        'ChIJVdeF58_ND4gRMFA_0bFnCzg',
        'Albany Park'
    ],
    [
        'ChIJ8bGFlRzMD4gRBQXfx6aJKt0',
        'Jefferson Park'
    ],
    ['ChIJ_U-yLYYsDogRtsVtHAvuj3E', 'Central'],
    ["Eiw1MTAxIFMgV2VudHdvcnRoIEF2ZSwgQ2hpY2FnbywgSUwgNjA2MDksIFVTQQ", "Wentworth"],
    ["EjA3MDQwIFMgQ290dGFnZSBHcm92ZSBBdmUsIENoaWNhZ28sIElMIDYwNjM3LCBVU0E", "Grand Crossing"],
    ["EicyMjU1IEUgMTAzcmQgU3QsIENoaWNhZ28sIElMIDYwNjE3LCBVU0E", "South Chicago"],
    ["ChIJD_JD3osmDogRaxeqSnR1vog", "Calumet"],
    ["ChIJ_7PlGWwvDogRuGGZCl0FIPk", "Gresham"],
    ["ChIJFxkSVlQuDogRsoTJI4DmdAg", "Englewood"],
    ["ChIJVeYUFM0xDogRdyQXgHGwNLg", "Chicago Lawn"],
    ["ChIJSwx4l0csDogRcXYCC5DAK0k", "Deering"],
    ["ChIJf5j6vGIyDogRgbIoD3CmgLM", "Odgen"],
    ["ChIJzzWLo5kyDogRFe6LF6g-0I0", "Harrison"],
    ["ChIJjdXDkP0sDogR7uYeJZ1JUk8","Near West"],
    ["ChIJmVC8_WHND4gRqKAO_28an0k", "Shakespeare"],
    ["ChIJ3U3ZEV0zDogRjD8SymPsopc", "Austin"]
];

/* functions about interacting with the daterange picker */
$(function () {
    var start = moment().subtract(14, 'days');
    var end = moment().subtract(7, 'days');

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
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

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

$(document).ready(function(){
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function(html) {
      var switchery = new Switchery(html, { size: 'small' });
    });

    var toggleHeat = document.querySelector('#turn-heat-on');
    toggleHeat.onchange = function() {
        if (toggleHeat.checked) {
            if (year_heat_points.length > 0) {
                heatmap = new google.maps.visualization.HeatmapLayer({
                        data: year_heat_points,
                        map: map
                });
            } else {
                var url = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=date between '2015-01-10T12:00:00' and '2016-01-10T14:00:00'";
                $.ajax({
                    url: url,
                    type: "GET",
                    data: {
                      "$limit" : 5000,
                      "$$app_token" : "FDC7kyefIjOvwcMZ0Z9NkFJJ8"
                    }
                }).done(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]['latitude'] != null && data[i]['longitude'] != null)
                        year_heat_points.push(new google.maps.LatLng(data[i]['latitude'], data[i]['longitude']));
                    }
                    heatmap = new google.maps.visualization.HeatmapLayer({
                            data: year_heat_points,
                            map: map
                    });
                });
            }
        } else {
            heatmap.setMap(null);
        }
    };
    var togglePoliceStations = document.querySelector('#turn-stations-on');
    togglePoliceStations.onchange = function() {
        if (togglePoliceStations.checked) {
            if (police_station_markers.length > 0) {
                for (var j = 0; j < police_station_markers.length; j++) {
                    police_station_markers[j].setVisible(true);
                }
            } else {
                setTimeout(getPlaces(10), 100000);
                setTimeout(getPlaces(20), 10000);
                // for (var i = 0; i < police_stations.length; i++) {
                //     var station_name = police_stations[i][1];
                //     console.log(station_name);
                //     placesService.getDetails({
                //         placeId: police_stations[i][0]
                //     }, function (place, status) {
                //         if (status === google.maps.places.PlacesServiceStatus.OK) {
                //             console.log("here");
                //             var marker = new google.maps.Marker({
                //                 'map': map,
                //                 'position': place.geometry.location
                //             });
                //             google.maps.event.addListener(marker, 'click', function () {
                //                 infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                //                     place.formatted_address + '</div>');
                //                 infowindow.open(map, this);
                //             });
                //             police_station_markers.push(marker);
                //         }
                //     });
                // }
            }
        } else {
            for (var j = 0; j < police_station_markers.length; j++) {
                police_station_markers[j].setVisible(false);
            }
        }
    }
});

function getPlaces(numPlaces) {
    for (var i = 0; i < numPlaces; i++) {
        var station_name = police_stations[i][1];
        console.log(station_name);
        placesService.getDetails({
            placeId: police_stations[i][0]
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log("here");
                var marker = new google.maps.Marker({
                    'map': map,
                    'position': place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        place.formatted_address + '</div>');
                    infowindow.open(map, this);
                });
                police_station_markers.push(marker);
            }
        });
    }
}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 41.85, lng: -87.65}
    });

    infowindow = new google.maps.InfoWindow();
    placesService = new google.maps.places.PlacesService(map);

    // placesService.getDetails({
    //       placeId: 'ChIJ_U-yLYYsDogRtsVtHAvuj3E'
    //     }, function(place, status) {
    //       if (status === google.maps.places.PlacesServiceStatus.OK) {
    //
    //         var marker = new google.maps.Marker({
    //           'map': map,
    //           'position': place.geometry.location
    //         });
    //         google.maps.event.addListener(marker, 'click', function() {
    //           infowindow.setContent('<div><strong>' + station_name + '</strong><br>' +
    //             place.formatted_address + '</div>');
    //           infowindow.open(map, this);
    //         });
    //       }
    //     });

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
        'rgba(255, 0, 0, 1)',
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
                                //heatmap.setMap(null);
                                heat_on = false;
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
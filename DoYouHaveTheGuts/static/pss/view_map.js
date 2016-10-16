var heatmap, map, entries, heatmap_global;
var directionsList = [];
var heat_on = false;
var year_heat_points = [];
var police_station_markers = [];
var police_stations = [
    [
        'EiUyIEUgR3JhbmQgQXZlLCBDaGljYWdvLCBJTCA2MDYxMSwgVVNB',
        'Grand Central',
        41.9186088912,
        -87.765574479,
        '5555 W Grand Ave,Chicago'
    ],
    [
        'ChIJyzbdbbzRD4gRudaLT2YMq3U',
        'Rogers Park',
        '5101 S Wentworth Ave, Chicago',
        41.9997634842,
        -87.6713242922,
        '6464 N Clark St,Chicago'
    ],
    [
        'ChIJYwtQpeQkDogRCMMSHo5AR9g',
        'Morgan Park',
        41.6914347795,
        -87.6685203937,
        '1900 W Monterey Ave'
    ],
    [
        'ChIJCZRGtv7RD4gRKsDivi_tElk',
        'Lincoln',
        41.9795495131,
        -87.6928445094,
        '5400 N Lincoln Ave,Chicago'
    ],
    [
        'ChIJ5eC7BbHTD4gRbJPRL85Je_M',
        'Town Hall',
        41.9474004564,
        -87.651512018,
        '850 W Addison St,Chicago'
    ],
    [
        'ChIJ2R8R1DDTD4gRvnfku2kJXUQ',
        'Near North',
        41.9032416531,
        -87.6433521393,
        '1160 N Larrabee St,Chicago'
    ],
    [
        'ChIJVdeF58_ND4gRMFA_0bFnCzg',
        'Albany Park',
        41.9660534171,
        -87.728114561,
        '4650 N Pulaski Rd,Chicago'
    ],
    [
        'ChIJ8bGFlRzMD4gRBQXfx6aJKt0',
        'Jefferson Park',
        41.9740944511,
        -87.7661488432,
        '5151 N Milwaukee Ave,Chicago'
    ],
    ["ChIJ_U-yLYYsDogRtsVtHAvuj3E", "Central", 41.85837259, -87.62735617, '1718 S State St,Chicago'],
    ["Eiw1MTAxIFMgV2VudHdvcnRoIEF2ZSwgQ2hpY2FnbywgSUwgNjA2MDksIFVTQQ", "Wentworth", 41.80181109, -87.63056018, '5101 S Wentworth Ave,Chicago'],
    ["EjA3MDQwIFMgQ290dGFnZSBHcm92ZSBBdmUsIENoaWNhZ28sIElMIDYwNjM3LCBVU0E", "Grand Crossing", 41.76643089, -87.60574786, '7040 S Cottage Grove Ave,Chicago'],
    ["EicyMjU1IEUgMTAzcmQgU3QsIENoaWNhZ28sIElMIDYwNjE3LCBVU0E", "South Chicago", 41.70793329, -87.56834912, '2255 E 103rd St,Chicago'],
    ["ChIJD_JD3osmDogRaxeqSnR1vog", "Calumet", 41.69272336, -87.60450587, '727 E 111th St,Chicago'],
    ["ChIJ_7PlGWwvDogRuGGZCl0FIPk", "Gresham", 41.75213684, -87.64422891, '7808 S Halsted St,Chicago'],
    ["ChIJFxkSVlQuDogRsoTJI4DmdAg", "Englewood", 41.77963154, -87.66088702, '1438 W 63rd St,Chicago'],
    ["ChIJVeYUFM0xDogRdyQXgHGwNLg", "Chicago Lawn", 41.77898719, -87.70886382, '3420 W 63rd St,Chicago'],
    ["ChIJSwx4l0csDogRcXYCC5DAK0k", "Deering", 41.83739443, -87.64640771, '3420 W 63rd St,Chicago'],
    ["ChIJf5j6vGIyDogRgbIoD3CmgLM", "Odgen", 41.85668453, -87.70838196,'3120 S Halsted St,Chicago'],
    ["ChIJzzWLo5kyDogRFe6LF6g-0I0", "Harrison", 41.87358229, -87.70548813,'3151 W Harrison St,Chicago'],
    ["ChIJjdXDkP0sDogR7uYeJZ1JUk8","Near West", 41.86297662, -87.65697251,'1412 S Blue Island Ave,Chicago'],
    ["ChIJmVC8_WHND4gRqKAO_28an0k", "Shakespeare", 41.92110332, -87.69745182,'2150 N California Ave,Chicago'],
    ["ChIJ3U3ZEV0zDogRjD8SymPsopc", "Austin", 41.88008346, -87.76819989,'5701 W Madison St,Chicago']
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

    $('.fa-spinner').addClass('hidden');

    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function(html) {
      var switchery = new Switchery(html, { size: 'small' });
    });

    var toggleHeat = document.querySelector('#turn-heat-on');
    toggleHeat.onchange = function() {
        if (toggleHeat.checked) {
            if (year_heat_points.length > 0) {
                heatmap_global = new google.maps.visualization.HeatmapLayer({
                        data: year_heat_points,
                        map: map
                });
            } else {
                //console.log("here");
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
                    heatmap_global = new google.maps.visualization.HeatmapLayer({
                            data: year_heat_points,
                            map: map
                    });
                });
            }
        } else {
            heatmap_global.setMap(null);
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
                // for (var i = 0; i < police_stations.length; i++) {
                //     placesService.getDetails({
                //         placeId: police_stations[i][0]
                //     }, function (place, status) {
                //         if (status === google.maps.places.PlacesServiceStatus.OK) {
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
                for (var i = 0; i < police_stations.length; i++) {
                    var myLatLng = {lat: police_stations[i][2], lng: police_stations[i][3]};
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map
                });
                    var station_name = police_stations[i][1];
                    var station_address = police_stations[i][4];
                    addEventToMarker(marker, station_name, station_address);
                    police_station_markers.push(marker);
                }
            }
            //}
        } else {
            for (var j = 0; j < police_station_markers.length; j++) {
                police_station_markers[j].setVisible(false);
            }
        }
    }
});
function addEventToMarker(marker, station_name, station_address){
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('<div><strong>' + station_name + '</strong><br>' +
             station_address + '</div>');
         infowindow.open(map, this);
     });
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
    $('.fa-spinner').removeClass('hidden');

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
            var optimize = data['optimizeWaypoints']
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
                                directionsList.push(customDirectionsDisplay);
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
            $('.fa-spinner').addClass('hidden');
        });
}
var heatmap, map;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65},
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
    $.get(
        '/get_map_data/',
        {'district': district, 'crime': crime},
        function (data) {
            route = data['route'];
            entries = data['heatmap'];
        }).done(function () {
        directionsService.route(route,
            function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    console.log('here');
                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: getPoints(),
                        map: map,
                    });
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
    });
}

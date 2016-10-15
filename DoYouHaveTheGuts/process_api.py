import os
import django
import requests
from decimal import Decimal
import _operator
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from pss.models import Station

app_token = 'FDC7kyefIjOvwcMZ0Z9NkFJJ8'
num_entries = 40
headers = {
    'X-App-Token': app_token
}


def get_crime_data():
    url = "https://data.cityofchicago.org/resource/6zsd-86xi.json" + "?$limit=" + str(num_entries)
    data = ''

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(data)

    return data


def get_station_data():
    url = "https://data.cityofchicago.org/resource/9rg7-mz9y.json"
    data = ''

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(data)

    return data


def save_crime_data(data):
    """
    Save the supplied crime data to the database.
    Note that the district numbers have leading zeroes removed.
    :param data: a list of dictionaries of crime datato save
    """
    for crime in data:
        try:
            cr = Crime.objects.get_or_create(crime_id=crime['id'],
                                        date=crime['date'],
                                        block=crime['block'],
                                        type=crime['primary_type'],
                                        subtype=crime['description'],
                                        district=Station.objects.get(district=int(crime['district'])),
                                        latitude=Decimal(crime['latitude']),
                                        longitude=Decimal(crime['longitude']))[0]
            cr.save()
        except KeyError:
            pass


def save_station_data(data):
    """
    Save the supplied station data to the database
    Note that Headquarters becomes district 26 here
    :param data: a list of dictionaries of station data
    """
    for station in data:
        if station['district'] == "Headquarters":
            station['district'] = '26'
        stat = Station.objects.get_or_create(district=int(station['district']),
                                      latitude=Decimal(station['latitude']),
                                      longitude=Decimal(station['longitude']),
                                      address=station['address'],
                                      name=station['district_name'])[0]
        stat.save()


def hottest_beats(district, start_time, end_time, type_of_crime, all_types=False):
    endpoint = 'https://data.cityofchicago.org/resource/6zsd-86xi.json'
    url = "%s?district=%s&$where=date between '%s' and '%s'" % (
        endpoint,
        str(district).zfill(3),
        start_time,
        end_time
    )

    if not all_types:
        url = url + "&primary_type=" + type_of_crime

    response = requests.get(url, headers=headers).json()

    crime_map = {}
    entries = []

    for entry in response:

        if entry['beat'] in crime_map:
            street = str(entry['block'])[6:] + ", Chicago"
            crime_map[entry['beat']][0] += 1
            crime_map[entry['beat']][1][street] = crime_map[entry['beat']][1].get(street, 0) + 1
        else:
            try:
                lat, long = entry['latitude'], entry['longitude']
                entries.append((lat, long))

                street = str(entry['block'])[6:] + ", Chicago"
                crime_map[entry['beat']] = [1, {street: 1}]
            except KeyError:
                pass

    n = len(crime_map)

    crime_map = sorted(crime_map.items(), key=_operator.itemgetter(0))[n-5:][::-1]

    route_info = {}
    station = Station.objects.get(district=district)

    route_info['origin'] = station.address
    route_info['destination'] = station.address
    route_info['travelMode'] = 'DRIVING'
    # route_info['route']['optimizeWaypoints'] = True
    route_info['waypoints'] = []

    for item in crime_map:
        street_stop = sorted(item[1][1].items(), key=lambda structure: structure[1])
        for i in range(4):
            try:
                route_info['waypoints'].append({'location': street_stop[-(i + 1)][0], 'stopover': False})
            except Exception:
                break

    route_info['heatmap'] = entries
    return route_info

# save
# save_station_data(get_station_data())
# save_crime_data(get_crime_data())

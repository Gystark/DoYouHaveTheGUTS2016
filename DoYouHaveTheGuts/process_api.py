import os
import django
import requests
import decimal
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from pss.models import Crime, Station

app_token = 'FDC7kyefIjOvwcMZ0Z9NkFJJ8'
num_entries = 2
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
    url = "https://data.cityofchicago.org/resource/9rg7-mz9y.json" + "?$limit=" + str(num_entries)
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
        Crime.objects.get_or_create(crime_id=crime['id'],
                                    date=crime['date'],
                                    block=crime['block'],
                                    type=crime['primary_type'],
                                    subtype=crime['description'],
                                    district=int(crime['district'][1:]),
                                    latitude=crime['latitude'],
                                    longitude=crime['longitude'])


def save_station_data(data):
    """
    Save the supplied station data to the database
    Note that Headquarters becomes district 26 here
    :param data: a list of dictionaries of station data
    """
    for station in data:
        Station.objects.get_or_create(district=station['district'],
                                      latitude=station['latitude'],
                                      longitude=station['longitude'])

c_data = get_crime_data()
st_data = get_station_data()

save_station_data(st_data)
save_crime_data(c_data)
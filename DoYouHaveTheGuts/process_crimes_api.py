import requests
import json
from pss.models import *

app_token = 'FDC7kyefIjOvwcMZ0Z9NkFJJ8'
num_entries = 2


def process_info():
    api_endpoint = 'https://data.cityofchicago.org/resource/6zsd-86xi.json'

    url = "%s?$limit=%d" % (api_endpoint, num_entries)

    headers = {
        'X-App-Token': app_token
    }

    json_response = json.loads(requests.get(headers=headers, url=api_endpoint).text)

    print(json_response)


if __name__ == '__main__':
    process_info()






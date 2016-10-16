"""
Populate the database with dummy data
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()

from django.contrib.auth.models import User
from process_api import save_station_data, get_station_data
from populate_news import populate

if __name__ == '__main__':
    u1 = User.objects.create_user("Officer A", "officer1@chicagopolice.gov", "ilovemyjob")
    u1.save()

    u2 = User.objects.create_user("Officer B", "officerb@chicagopolice.gov", "ilovemyjob")
    u2.save()

    u3 = User.objects.create_user("Captain C", "captainc@chicagopilice.gov", "ilovemyjob")
    u3.save()

    save_station_data(get_station_data())

    populate()
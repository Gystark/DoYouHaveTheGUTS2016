"""
Populate the database with dummy data
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()

from django.contrib.auth.models import User

u1 = User.objects.create_user("Officer A", "officer1@chicagopolice.gov", "ilovemyjob")
u1.save()

u2 = User.objects.create_user("Officer B", "officerb@chicagopolice.gov", "ilovemyjob")
u2.save()

u3 = User.objects.create_user("Captain C", "captainc@chicagopilice.gov", "ilovemyjob")
u3.save()

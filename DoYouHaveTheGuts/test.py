import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from pss.models import News

print(News.objects.all().count())


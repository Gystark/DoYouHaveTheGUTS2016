import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from pss.models import News

News.objects.all().delete()
print(News.objects.all().count())


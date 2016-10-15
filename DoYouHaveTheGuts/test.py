import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from pss.models import News
News.objects.all().delete()
# for n in News.objects.all():
#     print("HERE COMES THE NEW FILE ajdajffejfefeeeefegegege++++++++++++++++++++")
#     print('----')
#     print(n.title)
#     print(n.description)
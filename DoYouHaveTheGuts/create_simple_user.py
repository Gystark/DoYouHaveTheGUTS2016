import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from django.contrib.auth.models import User

# from django.contrib.auth.models import User
# from django.contrib.auth import authenticate, login
# user = User.objects.create_user('john', 'lennon@thebeatles.com', 'johnpassword')
#
# if __name__ == '__main__':
#     login()

# print(User.objects.get(
#         username='john',
#         email='lennon@thebeatles.com',
#         password='johnpassword'))

user = User.objects.get(username='john')
# print(user.password)

from notify.models import Notification

print(Notification.objects.all())

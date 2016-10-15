import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DoYouHaveTheGuts.settings')
django.setup()
from pss.models import News

def populate():
    news_file = open('news.txt', 'r')

    news_info = news_file.read().split('|')

    for news in news_info:
        title, description, body = news.split('~')
        news_object = News(
            title=title,
            description=description,
            body=body
        )
        news_object.save(send_notification=False)
    news_file.close()


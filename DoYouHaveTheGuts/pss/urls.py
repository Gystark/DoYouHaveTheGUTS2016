from django.conf.urls import url
from pss import views

urlpatterns = [
    url(r'^', views.index, name='index')
]

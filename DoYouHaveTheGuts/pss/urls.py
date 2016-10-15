from django.conf.urls import url
from pss import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_map_data/$', views.get_map_data, name='get_map_data')
]

from django.conf.urls import url
from pss import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_map_data/$', views.get_map_data, name='get_map_data'),
    url(r'^map/$', views.view_map, name='map'),
    # url(r'^search/$', views.search, name='search'),
    # url(r'^news/(?P<piece_of_news_slug>[\w\-]+)/$', views.view_piece_of_news, name='view_piece_of_news'),

]

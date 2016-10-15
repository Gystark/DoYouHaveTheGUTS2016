from django.conf.urls import url, include
from pss import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^accounts/$', include('django.contrib.auth.urls')),
    url(r'^$', views.index, name='index'),
    url(r'^get_map_data/$', views.get_map_data, name='get_map_data'),
    url(r'^map/$', views.view_map, name='map'),
    url(r'^register/$', views.UserRegistrationView.as_view(), name='registration'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
]

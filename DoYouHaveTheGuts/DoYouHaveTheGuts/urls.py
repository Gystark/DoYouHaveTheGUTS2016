from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('pss.urls')),
    url(r'^notifications/', include('notify.urls', 'notifications'))
]

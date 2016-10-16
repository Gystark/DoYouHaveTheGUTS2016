from django.conf.urls import url, include

urlpatterns = [
    url(r'^', include('pss.urls')),
    url(r'^notifications/', include('notify.urls', 'notifications'))
]

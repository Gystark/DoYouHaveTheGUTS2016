from django.shortcuts import render
from django.http import JsonResponse
from process_api import hottest_beats
from pss.models import Station, TYPE_CHOICES


def index(req):
    stations = Station.objects.all()
    types_of_crime = [x[0] for x in TYPE_CHOICES]
    return render(req, "pss/index.html", {
        'districts': stations,
        'types_of_crime': types_of_crime
    })


def get_map_data(request):
    if request.is_ajax():
        district = str(request.GET['district']).zfill(3)
        crime = request.GET['crime']

        json_response = hottest_beats(
            district=district,
            start_time='2011-01-10T12:00:00',
            end_time='2015-01-10T12:00:00',
            type_of_crime=crime)

        return JsonResponse(json_response)
    else:
        return render(request, "pss/temp.html", {})

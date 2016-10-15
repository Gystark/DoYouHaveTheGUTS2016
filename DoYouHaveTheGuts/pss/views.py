from django.shortcuts import render
from django.http import JsonResponse
from process_api import hottest_beats
from pss.models import Station, TYPE_CHOICES
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login


def index(req):
    user = User.objects.get(
        username='john')
    print(user)
    auth_user = authenticate(username=user.username, password=user.password)

    if auth_user is not None:
        print("Do we get here")
        login(req, user)

    return render(req, "pss/index.html", {})


def view_map(req):
    stations = Station.objects.all()
    types_of_crime = [x[0] for x in TYPE_CHOICES]
    return render(req, 'pss/view_map.html', {
        'districts': stations,
        'types_of_crime': types_of_crime
    })


def get_map_data(request):
    if request.is_ajax():
        district = request.GET['district']
        crime = request.GET['crime']
        start_date = request.GET['start_date']
        end_date = request.GET['end_date']

        json_response = hottest_beats(
            district=district,
            start_time=start_date,
            end_time=end_date,
            type_of_crime=crime,
            all_types=(crime == "all")
        )

        return JsonResponse(json_response)
    else:
        return render(request, "pss/view_map.html", {})

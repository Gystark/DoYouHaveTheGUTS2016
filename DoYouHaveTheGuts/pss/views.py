from django.shortcuts import render
from django.http import JsonResponse
from process_api import hottest_beats


def index(req):
    return render(req, "pss/index.html", {})


def test_map(request):
    if request.is_ajax():
        json_response = hottest_beats('009', '2013-01-10T12:00:00', '2015-01-10T12:00:00')
        return JsonResponse(json_response)
    else:
        return render(request, "pss/temp.html", {})
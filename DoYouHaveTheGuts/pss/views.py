from django.shortcuts import render
from django.http import JsonResponse
from process_api import hottest_beats
from pss.models import Station, TYPE_CHOICES, News
from pss.models import Station, TYPE_CHOICES
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.views.generic import CreateView
from django.contrib.auth import authenticate, login


def index(req):
    news = News.objects.all();
    return render(req, "pss/index.html", {'news': news})


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


# def search(request):
#     if request.GET:
#         search_term = request.GET['search-term']
#     else:
#         search_term = ''
#     news = News.objects.filter(title__icontains=search_term) or \
#            News.objects.filter(description__icontains=search_term) or \
#            News.objects.filter(body__icontains=search_term)
#     return render(request, 'pss/search.html', {'news': news})


# def view_piece_of_news(request, piece_of_news_name_slug):
#     context = {}
#     if request.method == "GET":
#         piece_of_news = News.objects.get(slug=piece_of_news_name_slug)
#         context['piece_of_news'] = piece_of_news
#     return render(request, 'pss/piece_of_news.html', context)


class UserRegistrationView(CreateView):
    form_class = UserCreationForm
    template_name = 'registration/registration.html'
    success_url = '/login'

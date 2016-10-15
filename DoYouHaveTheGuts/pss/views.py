from django.shortcuts import render
from django.http import JsonResponse
from process_api import hottest_beats
from pss.models import Station, TYPE_CHOICES, News
from django.contrib.auth.forms import UserCreationForm
from django.views.generic import CreateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponse


def user_login(request):
    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        # Gather the username and password provided by the user.
        # This information is obtained from the login form.
                # We use request.POST.get('<variable>') as opposed to request.POST['<variable>'],
                # because the request.POST.get('<variable>') returns None, if the value does not exist,
                # while the request.POST['<variable>'] will raise key error exception
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(username=username, password=password)

        # If we have a User object, the details are correct.
        # If None (Python's way of representing the absence of a value), no user
        # with matching credentials was found.
        if user:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # We'll send the user back to the homepage.
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your Rango account is disabled.")
        else:
            # Bad login details were provided. So we can't log the user in.
            return HttpResponse("Invalid login details supplied.")

    # The request is not a HTTP POST, so display the login form.
    # This scenario would most likely be a HTTP GET.
    else:
        # No context variables to pass to the template system, hence the
        # blank dictionary object...
        return render(request, 'registration/login.html', {})


@login_required(login_url='/login/')
def index(req):
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

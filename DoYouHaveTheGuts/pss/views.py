from django.shortcuts import render

def index(req):
    return render(req, "DoYouHaveTheGuts/index.html", {})

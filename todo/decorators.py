from django.shortcuts import redirect
from core.helpers import check_user_login


# Custom decorators

def signin_required(function):
    def wrap(request, *args, **kwargs):
        status, response = check_user_login(request)
        if status == 200:
            return function(request, *args, **kwargs)
        else:
            return redirect('/accounts/')
    return wrap


def signout_required(function):
    def wrap(request, *args, **kwargs):
        status, response = check_user_login(request)
        if status == 200:
            return redirect('/')
        else:
            return function(request, *args, **kwargs)
    return wrap
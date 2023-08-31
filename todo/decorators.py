from django.shortcuts import redirect
from administration.helpers import check_admin_login
from core.helpers import check_user_login
from django.urls import resolve

# Custom decorators

def signin_required(function):
    def wrap(request, *args, **kwargs):
        current_url = resolve(request.path_info)
        status, response = check_user_login(request)
        if status == 200:
            return function(request, *args, **kwargs)
        else:
            return redirect(f'/accounts/?next=/{current_url.route}')
    return wrap


def signout_required(function):
    def wrap(request, *args, **kwargs):
        status, response = check_user_login(request)
        if status == 200:
            return redirect('/')
        else:
            return function(request, *args, **kwargs)
    return wrap


def admin_signin_required(function):
    def wrap(request, *args, **kwargs):
        status, response = check_admin_login(request)
        if status == 200:
            return function(request, *args, **kwargs)
        else:
            return redirect('/administration/login/')
    return wrap
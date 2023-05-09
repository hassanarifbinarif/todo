from django.shortcuts import render, redirect
from core.helpers import check_user_login, confirm_user_email, get_dict_from_token


def index(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'index.html', context)


def property_search(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'property-search.html', context)


def property_listing(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'property-listing.html', context)


def accounts(request):
    return render(request, 'accounts.html')


def verify_registeration(request):
    msg = None
    success = False
    context = {}
    if request.GET.get('token'):
        token = request.GET.get('token')
        data_dict = get_dict_from_token(token)
        status, response = confirm_user_email(data_dict)
        if status == 200:
            msg = 'successful'
            success = True
        else:
            msg = 'failed'
        context['msg'] = msg
        context['success'] = success
    return render(request, 'verify-email.html', context)


def settings(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
        context['profile_info'] = response
    else:
        return redirect('/accounts/')
    return render(request, 'settings.html', context)


def add_property(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'add-property.html', context)

def about_us(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'about-us.html', context)

def news(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'news.html', context)
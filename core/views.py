from django.shortcuts import render, redirect
from core.helpers import check_user_login, confirm_user_email, get_dict_from_token, requestAPI
from todo.decorators import signin_required, signout_required
from django.conf import settings as django_settings


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


@signout_required
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


@signout_required
def verify_email(request):
    context = {}
    if request.method == 'GET':
        context['token'] = request.GET.get('token')
    return render(request, 'reset-password.html', context)


@signout_required
def forgot_password(request):
    return render(request, 'forgot-password.html')


@signin_required
def settings(request):
    context = {}
    try:
        access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f"Bearer {access_token}"}
        status, response = requestAPI('GET', f'{django_settings.API_URL}/me', headers, {})
        if status == 200:
            context['profile_info'] = response
            plan_status, plan_response = requestAPI('GET', f'{django_settings.API_URL}/plans/list', headers, {})
            if plan_status == 200:
                context['plan_list'] = plan_response
            listing_status, listing_response = requestAPI('GET', f'{django_settings.API_URL}/listings', headers, {})
            if listing_status == 200:
                context['listings'] = listing_response
                # print(listing_response)
    except Exception as e:
        print(e)
    context['login'] = True
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
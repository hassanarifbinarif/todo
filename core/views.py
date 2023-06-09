import json
from django.shortcuts import render
from core.helpers import check_user_login, confirm_user_email, get_dict_from_token, requestAPI
from todo.decorators import signin_required, signout_required
from django.conf import settings as django_settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader


def index(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        publicity_status, publicity_response = requestAPI('GET', f'{django_settings.API_URL}/publicity/1', {}, {})
        if publicity_status == 200:
            context['publicity'] = publicity_response
    except Exception as e:
        print(e)
    return render(request, 'core_templates/index.html', context)


def property_search(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings/list', {}, {})
        context['properties'] = response
        publicity_status1, publicity_response1 = requestAPI('GET', f'{django_settings.API_URL}/publicity/2', {}, {})
        publicity_status2, publicity_response2 = requestAPI('GET', f'{django_settings.API_URL}/publicity/3', {}, {})
        publicity_status3, publicity_response3 = requestAPI('GET', f'{django_settings.API_URL}/publicity/4', {}, {})
        context['publicity'] = {"publicity1": publicity_response1,
                                "publicity2": publicity_response2,
                                "publicity3": publicity_response3} 
    except Exception as e:
        print(e)
    return render(request, 'core_templates/property-search.html', context)


def property_listing(request, pk):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings/{pk}', {}, {})
        context['property'] = response
        publicity_status, publicity_response = requestAPI('GET', f'{django_settings.API_URL}/publicity/5', {}, {})
        context['publicity'] = publicity_response
    except Exception as e:
        print(e)
    return render(request, 'core_templates/property-listing.html', context)


@signout_required
def accounts(request):
    response = render(request, 'core_templates/accounts.html')
    response["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    return response


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
    return render(request, 'core_templates/verify-email.html', context)


@signout_required
def verify_email(request):
    context = {}
    if request.method == 'GET':
        context['token'] = request.GET.get('token')
    return render(request, 'core_templates/reset-password.html', context)


@signout_required
def forgot_password(request):
    return render(request, 'core_templates/forgot-password.html')


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
    except Exception as e:
        print(e)
    context['login'] = True
    return render(request, 'core_templates/settings.html', context)


@csrf_exempt
def get_user_listings(request):
    context = {}
    context['msg'] = None
    context['success'] = False
    try:
        user_access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f'Bearer {user_access_token}'}
        status, response = requestAPI('GET', 'https://api-dev.todo.com.ec/api/listings', headers, {})
        if status == 200:
            text_template = loader.get_template('ajax/users-listing-table.html')
            html = text_template.render({'listings':response})
            context['listing_data'] = html
            context['msg'] = 'Listings retrieved'
            context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@signin_required
def add_property(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'core_templates/add-property.html', context)


def about_us(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        status, response = requestAPI('GET', f'{django_settings.API_URL}/news/list', {}, {})
        if status == 200:
            context['news_list'] = response
    except Exception as e:
        print(e)
    return render(request, 'core_templates/about-us.html', context)


def news(request, pk):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        status, response = requestAPI('GET', f'{django_settings.API_URL}/news/{pk}', {}, {})
        if status == 200:
            context['news_content'] = response
    except Exception as e:
        print(e)
    return render(request, 'core_templates/news.html', context)


def terms_and_conditions(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'core_templates/terms-and-conditions.html', context)


def privacy_policy(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    return render(request, 'core_templates/privacy-policy.html', context)
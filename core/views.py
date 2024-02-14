import json
from django.shortcuts import render
from core.helpers import check_user_login, confirm_user_email, get_dict_from_token, requestAPI
from todo.decorators import signin_required, signout_required
from django.conf import settings as django_settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
import math


def index(request):
    context = {}
    status, response = check_user_login(request)
    headers = {}
    if status == 200:
        context['login'] = True
        access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f"Bearer {access_token}"}
        try:
            recent_viewed_status, recent_viewed_response = requestAPI('GET', f'{django_settings.API_URL}/search-listings/recently-visited', headers, {})
            context['recently_viewed'] = recent_viewed_response
        except Exception as e:
            print(e)
    try:
        search_status, search_response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?perPage=1', {}, {})
        context['total_properties'] = search_response['pagination']['total']
        loc_status, loc_response = requestAPI('GET', 'https://ipinfo.io/json', {}, {})
        lat, lng = loc_response['loc'].split(',')
        spotlight_status, spotlight_response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?is_boosted=true&location=SRID=4326;POINT ({lng} {lat})', headers, {})
        context['spotlight_properties'] = spotlight_response
    except Exception as e:
        print(e)
    return render(request, 'core_templates/index.html', context)


@csrf_exempt
def property_search(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
        access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f"Bearer {access_token}"}
    else:
        context['login'] = False
    try:    
        if request.method == 'POST':
            context["criteria"] = request.POST.get('criteria_radio', '')
            context["property_type"] = request.POST.get('property_radio', '')
            context["min_price"] = request.POST.get('min_price', '')
            context["max_price"] = request.POST.get('max_price', '')
            context["city"] = request.POST.get('city')
            if context['login'] == True:
                status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?perPage=20&criteria={context["criteria"]}&property_type__in={context["property_type"]}&price__gte={context["min_price"]}&price__lte={context["max_price"]}&city={context["city"]}', headers, {})
            else:
                status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?perPage=20&criteria={context["criteria"]}&property_type__in={context["property_type"]}&price__gte={context["min_price"]}&price__lte={context["max_price"]}&city={context["city"]}', {}, {})
        else:
            if context['login'] == True:
                status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?perPage=20', headers, {})
            else:
                status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?perPage=20', {}, {})
        
        if response['pagination']['links']['next']:
            next_page_number = response['pagination']['currentPage'] + 1
            next_next_page_number = next_page_number + 1
            if next_page_number >= response['pagination']['total']:
                response['pagination']['next_page_number'] = None
            else:
                response['pagination']['next_page_number'] = next_page_number
            if next_next_page_number >= response['pagination']['total']:
                response['pagination']['next_next_page_number'] = None
            else:
                response['pagination']['next_next_page_number'] = next_next_page_number
        response['pagination']['starting_record'] = (response['pagination']['currentPage'] - 1) * response['pagination']['perPage'] + 1
        response['pagination']['ending_record'] = min(response['pagination']['starting_record'] + response['pagination']['perPage'] - 1, response['pagination']['count'])
        context['properties'] = response
    except Exception as e:
        print(e)
    context['key'] = django_settings.GOOGLE_MAPS_API_KEY
    return render(request, 'core_templates/property-search.html', context)


@csrf_exempt
def get_search_properties(request):
    context = {}
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        if request_data['pagination']['links']['next']:
            next_page_number = request_data['pagination']['currentPage'] + 1
            next_next_page_number = next_page_number + 1
            if next_page_number >= request_data['pagination']['total']:
                request_data['pagination']['next_page_number'] = None
            else:
                request_data['pagination']['next_page_number'] = next_page_number
            if next_next_page_number >= request_data['pagination']['total']:
                request_data['pagination']['next_next_page_number'] = None
            else:
                request_data['pagination']['next_next_page_number'] = next_next_page_number
        request_data['pagination']['starting_record'] = (request_data['pagination']['currentPage'] - 1) * request_data['pagination']['perPage'] + 1
        request_data['pagination']['ending_record'] = min(request_data['pagination']['starting_record'] + request_data['pagination']['perPage'] - 1, request_data['pagination']['count'])
        text_template = loader.get_template('ajax/property-card.html')
        html = text_template.render({'properties':request_data})
        context['property'] = html
        context['msg'] = 'Filter successful'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


def property_listing(request, pk):
    context = {}
    status, response = check_user_login(request)
    context['is_mobile'] = request.user_agent.is_mobile
    if status == 200:
        context['login'] = True
        access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f"Bearer {access_token}"}
    else:
        context['login'] = False
    try:
        if context['login'] == True:
            status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings/{pk}', headers, {})
            similar_properties_status, similar_properties_response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?exclude_ids={pk}&property_type__in={response["data"]["property_type"]}&location={response["data"]["location"]}', headers, {})
        else:
            status, response = requestAPI('GET', f'{django_settings.API_URL}/search-listings/{pk}', {}, {})
            similar_properties_status, similar_properties_response = requestAPI('GET', f'{django_settings.API_URL}/search-listings?exclude_ids={pk}&property_type__in={response["data"]["property_type"]}&location={response["data"]["location"]}', {}, {})
        context['property'] = response
        context['property_location'] = response['data']['location']
        context['similar_properties'] = similar_properties_response
    except Exception as e:
        print(e)
    context['key'] = django_settings.GOOGLE_MAPS_API_KEY
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
    context['is_mobile'] = request.user_agent.is_mobile
    try:
        access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f"Bearer {access_token}"}
        status, response = requestAPI('GET', f'{django_settings.API_URL}/me', headers, {})
        if status == 200:
            context['profile_info'] = response
            plan_status, plan_response = requestAPI('GET', f'{django_settings.API_URL}/plans/list', headers, {})
            context['plan_list'] = plan_response
            listing_status, listing_response = requestAPI('GET', f'{django_settings.API_URL}/listings', headers, {})
            context['listings'] = listing_response
            favourite_listing_status, favourite_listing_response = requestAPI('GET', f'{django_settings.API_URL}/listings/favourites', headers, {})
            context['favourite_listings'] = favourite_listing_response
    except Exception as e:
        print(e)
    context['login'] = True
    context['key'] = django_settings.GOOGLE_MAPS_API_KEY
    return render(request, 'core_templates/settings.html', context)


@csrf_exempt
def get_user_listings(request):
    context = {}
    context['msg'] = None
    context['success'] = False
    context['is_mobile'] = request.user_agent.is_mobile
    request_data = json.loads(request.body.decode('utf-8'))
    try:
        user_access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f'Bearer {user_access_token}'}
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        if status == 200:
            text_template = loader.get_template('ajax/users-listing-table.html')
            html = text_template.render({'listings':response, 'is_mobile': context['is_mobile']})
            context['listing_data'] = html
            context['msg'] = 'Listings retrieved'
            context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@csrf_exempt
def get_user_favourite_listings(request):
    context = {}
    context['msg'] = None
    context['success'] = False
    context['is_mobile'] = request.user_agent.is_mobile
    request_data = json.loads(request.body.decode('utf-8'))
    try:
        user_access_token = request.COOKIES.get('user_access_token')
        headers = {"Authorization": f'Bearer {user_access_token}'}
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        if status == 200:
            text_template = loader.get_template('ajax/users-favourite-listing-table.html')
            html = text_template.render({'favourite_listings':response, 'is_mobile': context['is_mobile']})
            context['favourite_listing_data'] = html
            context['msg'] = 'Favourite Listings retrieved'
            context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@signin_required
def add_property(request):
    context = {}
    context['login'] = True
    context['key'] = django_settings.GOOGLE_MAPS_API_KEY
    return render(request, 'core_templates/add-property.html', context)


def about_us(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        news_status, news_response = requestAPI('GET', f'{django_settings.API_URL}/news/list?perPage=1000', {}, {})
        context['news_list'] = news_response
    except Exception as e:
        print(e)
    return render(request, 'core_templates/about-us.html', context)


def news(request, pk):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
    try:
        news_status, new_response = requestAPI('GET', f'{django_settings.API_URL}/news/{pk}', {}, {})
        context['news_content'] = new_response
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
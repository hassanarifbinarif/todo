import json
from django.shortcuts import render
from core.helpers import requestAPI
from todo.decorators import admin_signin_required
from django.conf import settings as django_settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader



def login(request):
    return render(request, 'administration_templates/login.html')


@admin_signin_required
def dashboard(request):
    context = {}
    context['active_page'] = 'dashboard'
    return render(request, 'administration_templates/dashboard.html', context)


@admin_signin_required
def listings(request):
    context = {}
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{django_settings.API_URL}/admin/listings', headers, {})
        if status == 200:
            context['listings'] = response
    except Exception as e:
        print(e)
    context['active_page'] = 'listings'
    context['key'] = django_settings.GOOGLE_MAPS_API_KEY
    return render(request, 'administration_templates/listings.html', context)


@csrf_exempt
def get_listings(request):
    context = {}
    context['msg'] = None
    context['success'] = False
    request_data = json.loads(request.body.decode('utf-8'))
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        if status == 200:
            text_template = loader.get_template('ajax/listings-table.html')
            html = text_template.render({'listings':response})
            context['listing_data'] = html
            context['msg'] = 'Listings retrieved'
            context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def users(request):
    context = {}
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{django_settings.API_URL}/admin/users', headers, {})
        if status == 200:
            context['users'] = response
    except Exception as e:
        print(e)
    context['active_page'] = 'users'
    return render(request, 'administration_templates/users.html', context)


@csrf_exempt
def get_users(request):
    context = {}
    context['msg'] = None
    context['success'] = False
    request_data = json.loads(request.body.decode('utf-8'))
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        if status == 200:
            text_template = loader.get_template('ajax/users-table.html')
            html = text_template.render({'users':response})
            context['user_data'] = html
            context['msg'] = 'User data retrieved'
            context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def plans(request):
    context = {}
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{django_settings.API_URL}/admin/plans', headers, {})
        if status == 200:
            context['plans'] = response
    except Exception as e:
        print(e)
    context['active_page'] = 'plans'
    return render(request, 'administration_templates/plans.html', context)


@admin_signin_required
def add_news(request):
    context = {}
    context['active_page'] = 'add_news'
    return render(request, 'administration_templates/add-news.html', context)


@admin_signin_required
def publicity(request):
    context = {}
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{django_settings.API_URL}/admin/publicity', headers, {})
        if status == 200:
            context['publicity'] = response
    except Exception as e:
        print(e)
    context['active_page'] = 'publicity'
    return render(request, 'administration_templates/publicity.html', context)
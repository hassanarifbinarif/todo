from django.shortcuts import render, redirect
from core.helpers import check_user_login, confirm_user_email, get_dict_from_token, requestAPI


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
    status, response = check_user_login(request)
    if status == 200:
        return redirect('/')
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


def verify_email(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        return redirect('/')
    if request.method == 'GET':
        context['token'] = request.GET.get('token')
    return render(request, 'reset-password.html', context)


def forgot_password(request):
    status, response = check_user_login(request)
    if status == 200:
        return redirect('/')
    return render(request, 'forgot-password.html')


def settings(request):
    context = {}
    status, response = check_user_login(request)
    if status == 200:
        context['login'] = True
        context['profile_info'] = response
        headers = {"Authorization": f"Bearer {request.COOKIES.get('user_access_token')}"}
        plan_status, plan_response = requestAPI('GET', 'http://3.140.78.251:8000/api/plans/list', headers, {})
        if plan_status == 200:
            context['plan_list'] = plan_response
        # print(plan_status, plan_response)
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
from django.shortcuts import render


def login(request):
    return render(request, 'administration_templates/login.html')


def dashboard(request):
    context = {}
    context['active_page'] = 'dashboard'
    return render(request, 'administration_templates/dashboard.html', context)


def listings(request):
    context = {}
    context['active_page'] = 'listings'
    return render(request, 'administration_templates/listings.html', context)


def users(request):
    context = {}
    context['active_page'] = 'users'
    return render(request, 'administration_templates/users.html', context)


def plans(request):
    context = {}
    context['active_page'] = 'plans'
    return render(request, 'administration_templates/plans.html', context)


def add_news(request):
    context = {}
    context['active_page'] = 'add_news'
    return render(request, 'administration_templates/add-news.html', context)


def publicity(request):
    context = {}
    context['active_page'] = 'publicity'
    return render(request, 'administration_templates/publicity.html', context)
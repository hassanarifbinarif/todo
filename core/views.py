from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

def property_search(request):
    return render(request, 'property-search.html')

def property_listing(request):
    return render(request, 'property-listing.html')

def accounts(request):
    return render(request, 'accounts.html')

def verify_email(request):
    msg = None
    success = False
    return render(request, 'verify-email.html')

def settings(request):
    context = {}
    context['navbar'] = 'settings'
    return render(request, 'settings.html', context)

def add_property(request):
    context = {}
    context['navbar'] = 'settings'
    return render(request, 'add-property.html', context)

def about_us(request):
    context = {}
    context['navbar'] = 'settings'
    return render(request, 'about-us.html', context)

def news(request):
    context = {}
    context['navbar'] = 'setings'
    return render(request, 'news.html', context)
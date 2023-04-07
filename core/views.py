from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

def property_search(request):
    return render(request, 'property-search.html')

def property_listing(request):
    return render(request, 'property-listing.html')

def accounts(request):
    return render(request, 'accounts.html')

def settings(request):
    context = {}
    context['navbar'] = 'settings'
    return render(request, 'settings.html', context)
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('property-search/', views.property_search, name='property_search'),
    path('property-listing/', views.property_listing, name='property_listing'),
    path('accounts/', views.accounts, name='accounts'),
    path('settings/', views.settings, name='settings')
]
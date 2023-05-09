from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('property-search/', views.property_search, name='property_search'),
    path('property-listing/', views.property_listing, name='property_listing'),
    path('accounts/', views.accounts, name='accounts'),
    path('verify-registeration/', views.verify_registeration, name='verify_registeration'),
    path('settings/', views.settings, name='settings'),
    path('add-property/', views.add_property, name='add_property'),
    path('about-us/', views.about_us, name='about_us'),
    path('news/', views.news, name='news')
]
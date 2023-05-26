from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('listings/', views.listings, name='listings'),
    path('users/', views.users, name='users'),
    path('get-users/', views.get_users, name='get_users'),
    path('plans/', views.plans, name='plans'),
    path('add-news/', views.add_news, name='add_news'),
    path('publicity/', views.publicity, name='publicity')
]
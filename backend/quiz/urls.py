from django.urls import path
from . import views

urlpatterns = [
    path('webhook/', views.webhook, name='webhook'),
    path('checkmembership/', views.check_membership, name='check_channel_membership'),
]

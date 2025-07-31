from django.urls import path
from . import views


urlpatterns = [
    # حذف api/ از اینجا چون در urls.py اصلی اضافه میشه
    path('verify-membership/', views.verify_membership, name='verify_membership'),
    path('webhook/telegram/', views.telegram_webhook, name='telegram_webhook'),
]
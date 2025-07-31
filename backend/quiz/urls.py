from django.urls import path
from . import views

urlpatterns = [
    # API endpoints
    path('api/verify-membership/', views.verify_membership, name='verify_membership'),

    # Telegram webhook (اختیاری)
    path('webhook/telegram/', views.telegram_webhook, name='telegram_webhook'),
]

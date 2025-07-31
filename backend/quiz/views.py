# views.py
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import TelegramUser
import logging

# تنظیمات
CHANNEL_USERNAME = "havalikhodemoon"  # نام کانال شما
BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN

logger = logging.getLogger(__name__)


@api_view(['POST'])
def verify_membership(request):
    """
    API برای بررسی عضویت کاربر در کانال از طریق Web App
    """
    try:
        telegram_id = request.data.get('telegram_id')
        username = request.data.get('username', '')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        if not telegram_id:
            return Response({
                'success': False,
                'error': 'شناسه تلگرام مورد نیاز است'
            }, status=400)

        # بررسی عضویت در کانال
        is_member = check_channel_membership(telegram_id)

        if is_member:
            # ثبت یا آپدیت کاربر
            user, created = TelegramUser.objects.get_or_create(
                telegram_id=telegram_id,
                defaults={
                    'username': username,
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_verified': True
                }
            )

            if not created:
                user.is_verified = True
                user.save()

            return Response({
                'success': True,
                'is_member': True,
                'user_id': user.id,
                'message': 'عضویت تایید شد!'
            })
        else:
            return Response({
                'success': False,
                'is_member': False,
                'error': 'شما عضو کانال نیستید',
                'channel_link': f'https://t.me/{CHANNEL_USERNAME}'
            })

    except Exception as e:
        logger.error(f"Error in verify_membership: {str(e)}")
        return Response({
            'success': False,
            'error': 'خطا در بررسی عضویت'
        }, status=500)


def check_channel_membership(user_id):
    """
    بررسی عضویت کاربر در کانال با استفاده از Telegram Bot API
    """
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/getChatMember"
        params = {
            "chat_id": f"@{CHANNEL_USERNAME}",
            "user_id": user_id
        }

        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if data.get("ok"):
            status = data["result"]["status"]
            # وضعیت‌های معتبر برای عضویت
            valid_statuses = ["member", "administrator", "creator"]
            return status in valid_statuses
        else:
            logger.warning(f"Telegram API error: {data.get('description', 'Unknown error')}")
            return False

    except requests.RequestException as e:
        logger.error(f"Network error in check_channel_membership: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error in check_channel_membership: {str(e)}")
        return False


@csrf_exempt
@require_http_methods(["POST"])
def telegram_webhook(request):
    """
    Webhook برای دریافت پیام‌های تلگرام (اختیاری - برای ربات)
    """
    try:
        data = json.loads(request.body)

        # پردازش پیام‌های تلگرام
        if 'message' in data:
            chat_id = data['message']['chat']['id']
            user_id = data['message']['from']['id']
            text = data['message'].get('text', '').lower()

            if text == '/start':
                send_welcome_message(chat_id)
            elif 'بررسی عضویت' in text:
                handle_membership_check(chat_id, user_id)

        elif 'callback_query' in data:
            # پردازش callback queries
            callback_data = data['callback_query']['data']
            chat_id = data['callback_query']['message']['chat']['id']
            user_id = data['callback_query']['from']['id']

            if callback_data == 'check_membership':
                handle_membership_check(chat_id, user_id)

        return JsonResponse({"status": "success"})

    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return JsonResponse({"status": "error"}, status=500)


def send_welcome_message(chat_id):
    """
    ارسال پیام خوش‌آمدگویی
    """
    message = """
🎭 سلام! به ربات نمای شخصیت خوش آمدید

برای شروع تست شخصیت، ابتدا در کانال ما عضو شوید:
👈 @havalikhodemoon

سپس دکمه زیر را بزنید:
    """

    keyboard = {
        "inline_keyboard": [
            [{"text": "📢 عضویت در کانال", "url": f"https://t.me/{CHANNEL_USERNAME}"}],
            [{"text": "✅ بررسی عضویت", "callback_data": "check_membership"}]
        ]
    }

    send_telegram_message(chat_id, message, keyboard)


def handle_membership_check(chat_id, user_id):
    """
    بررسی عضویت و ارسال پاسخ مناسب
    """
    is_member = check_channel_membership(user_id)

    if is_member:
        message = "✅ عضویت شما تایید شد!\n\nبرای شروع تست شخصیت، دکمه زیر را بزنید:"
        keyboard = {
            "inline_keyboard": [
                [{"text": "🚀 شروع تست شخصیت", "web_app": {"url": "https://namayeshakhsiat.xyz"}}]
            ]
        }
    else:
        message = "❌ شما هنوز عضو کانال نیستید.\n\nلطفاً ابتدا عضو شوید سپس مجدداً بررسی کنید:"
        keyboard = {
            "inline_keyboard": [
                [{"text": "📢 عضویت در کانال", "url": f"https://t.me/{CHANNEL_USERNAME}"}],
                [{"text": "🔄 بررسی مجدد", "callback_data": "check_membership"}]
            ]
        }

    send_telegram_message(chat_id, message, keyboard)


def send_telegram_message(chat_id, text, reply_markup=None):
    """
    ارسال پیام به تلگرام
    """
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML"
        }

        if reply_markup:
            data["reply_markup"] = json.dumps(reply_markup)

        response = requests.post(url, json=data, timeout=10)
        return response.json()

    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")
        return None
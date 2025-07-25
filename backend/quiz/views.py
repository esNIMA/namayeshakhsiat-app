# views.py
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram import Bot
from django.conf import settings


@csrf_exempt
def webhook(request):
    """
    Webhook endpoint for receiving updates from Telegram.
    """
    if request.method == "POST":
        # دریافت داده‌ها از تلگرام
        data = json.loads(request.body)

        # ایجاد شیء Update از داده‌های دریافتی
        bot = Bot(settings.TELEGRAM_BOT_TOKEN)
        update = bot._process_new_updates([data])[0]  # پردازش آپدیت

        chat_id = update.message.chat.id
        user_id = update.message.from_user.id

        # بررسی دستور یا پیام ارسال‌شده
        if update.message.text.lower() == "بررسی عضویت":
            return check_membership(update, chat_id, user_id)
        else:
            bot.send_message(chat_id, "پیام شما درک نشد.")
            return JsonResponse({"status": "success"})

    return JsonResponse({"status": "failed", "message": "Invalid method"}, status=400)


def check_membership(update, chat_id, user_id):
    """
    بررسی عضویت کاربر در کانال
    """
    channel_username = "CharacterSurvey"  # نام کانال شما
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getChatMember"
    params = {"chat_id": f"@{channel_username}", "user_id": user_id}

    response = requests.get(url, params=params)
    data = response.json()

    if data.get("ok") and data["result"]["status"] in ["member", "administrator", "creator"]:
        # اگر کاربر عضو کانال باشد، دکمه ورود به وب اپ ارسال می‌شود
        keyboard = [
            [InlineKeyboardButton("ورود به وب اپ", url="https://your-web-app.com")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        update.message.reply_text(
            "شما عضو کانال هستید. برای ورود به وب اپ، لطفاً دکمه زیر را بزنید.",
            reply_markup=reply_markup
        )
    else:
        # اگر کاربر عضو کانال نباشد، دکمه بررسی مجدد عضویت ارسال می‌شود
        keyboard = [
            [InlineKeyboardButton("بررسی مجدد عضویت", callback_data="check_membership")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        update.message.reply_text(
            "شما عضو کانال نیستید. لطفاً بررسی مجدد کنید.",
            reply_markup=reply_markup
        )

    return JsonResponse({"status": "success"})

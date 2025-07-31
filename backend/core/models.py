from django.db import models
from django.contrib.auth.models import User


class TelegramUser(models.Model):
    telegram_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=100, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    is_verified = models.BooleanField(default=False)  # اضافه شده
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # اضافه شده

    def __str__(self):
        return f"{self.first_name} (@{self.username}) - {'✅' if self.is_verified else '❌'}"

class Channel(models.Model):
    channel_id = models.BigIntegerField(unique=True)
    channel_username = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Channel"
        verbose_name_plural = "Channels"

    def __str__(self):
        return self.channel_username

class BotStatus(models.Model):
    is_locked = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = "Bot Status"
        verbose_name_plural = "Bot Status"

    def __str__(self):
        return "Locked" if self.is_locked else "Unlocked"
from django.contrib import admin
from .models import Section, Question, Answer, AnswerSubmission

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'key', 'created_at', 'updated_at')
    search_fields = ('name', 'key')
    ordering = ('name',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('section', 'order', 'text', 'created_at', 'updated_at')
    list_filter = ('section__name',)
    search_fields = ('text',)
    ordering = ('section__name', 'order')

@admin.register(AnswerSubmission)
class AnswerSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')
    search_fields = ('user__first_name', 'user__telegram_id')
    ordering = ('-created_at',)

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('get_user', 'question', 'score', 'created_at')
    list_filter = ('question__section__name',)
    search_fields = ('submission__user__first_name', 'question__text')

    def get_user(self, obj):
        return obj.submission.user

    get_user.short_description = "User"

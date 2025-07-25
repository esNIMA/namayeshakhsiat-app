#API urls
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SectionViewSet, QuestionViewSet, AnswerViewSet,AnswerSubmissionViewSet

router = DefaultRouter()
router.register(r'sections', SectionViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'answer-submissions', AnswerSubmissionViewSet)
urlpatterns = [
    path('', include(router.urls)),
]

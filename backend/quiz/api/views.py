from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from quiz.models import Section, Question, Answer, AnswerSubmission
from core.models import TelegramUser
from .serializers import (
    SectionSerializer,
    QuestionSerializer,
    AnswerSerializer,
    AnswerSubmissionSerializer
)


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [AllowAny]


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdminUser()]
        return [IsAuthenticated()]


class AnswerSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AnswerSubmission.objects.all()
    serializer_class = AnswerSubmissionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            telegram_id = request.data.get("user")
            first_name = request.data.get("first_name", "")

            user, created = TelegramUser.objects.get_or_create(
                telegram_id=telegram_id,
                defaults={"first_name": first_name}
            )

            request_data = request.data.copy()
            request_data["user"] = user.pk  # اینجا pk اصلی

            serializer = self.get_serializer(data=request_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"❌ خطا در create AnswerSubmission: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

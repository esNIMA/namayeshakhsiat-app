from rest_framework import serializers
from quiz.models import Section, Question, Answer, AnswerSubmission
from core.models import TelegramUser


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'key', 'name']


class QuestionSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'section', 'text', 'order']


class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())

    class Meta:
        model = Answer
        fields = ['question', 'score', 'description']


class AnswerSubmissionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=TelegramUser.objects.all())
    answers = AnswerSerializer(many=True)

    class Meta:
        model = AnswerSubmission
        fields = ['id', 'user', 'answers', 'created_at']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        submission = AnswerSubmission.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(submission=submission, **answer_data)
        return submission

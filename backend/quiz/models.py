from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import TelegramUser

class Section(models.Model):
    key = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Section"
        verbose_name_plural = "Sections"

    def __str__(self):
        return self.name


class Question(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"
        unique_together = ['section', 'order']  # Ensures unique order per section

    def __str__(self):
        return f"{self.section.name} - Question {self.order}"


class AnswerSubmission(models.Model):
    user = models.ForeignKey(TelegramUser, on_delete=models.CASCADE, related_name='submissions')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Answer Submission"
        verbose_name_plural = "Answer Submissions"

    def __str__(self):
        return f"Submission {self.id} - {self.user}"


class Answer(models.Model):
    submission = models.ForeignKey(
        AnswerSubmission,
        on_delete=models.CASCADE,
        related_name='answers',
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Answer"
        verbose_name_plural = "Answers"

    def __str__(self):
        return f"{self.submission.user} - Q{self.question.id} - {self.score}"

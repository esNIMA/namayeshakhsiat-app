
# Backend Dockerfile برای Django
FROM python:3.11-slim

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# نصب پکیج‌های سیستمی
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    netcat-traditional \
    curl \
    && rm -rf /var/lib/apt/lists/*

# تنظیم working directory
WORKDIR /app

# کپی requirements و نصب Python packages
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# کپی کد پروژه
COPY . /app/

# جمع‌آوری static files
RUN python manage.py collectstatic --noinput || echo "Static files will be collected later"

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# اجرای Django با Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "CharacterSurvey.wsgi:application"]

EXPOSE 8000
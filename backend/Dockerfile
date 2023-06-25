FROM python:3.10.8-slim

# Install system dependencies
RUN apt-get update -y && apt-get install -y python3-pip python3-dev build-essential

# Set up the working directory
RUN mkdir /app
WORKDIR /app

# Copy the project files
COPY pyproject.toml poetry.lock ./

# Install project dependencies
RUN pip install --upgrade pip && pip install poetry && poetry config virtualenvs.create false && poetry install --no-dev

# Copy the rest of the project files
COPY . .

# Run Django management commands
RUN python manage.py collectstatic --noinput
RUN python manage.py migrate
RUN python manage.py createsuperuser

# Install Gunicorn
RUN pip install gunicorn

# Expose the necessary port (adjust as per your Django settings)
EXPOSE 8000

# Start the server using Gunicorn
CMD ["gunicorn", "liho.wsgi:application", "--bind", "0.0.0.0:8000"]

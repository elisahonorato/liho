FROM python:3.10.8-slim
RUN apt-get update -y && apt-get install -y python3-pip python3-dev build-essential
RUN mkdir /app
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --upgrade pip && pip install poetry && poetry config virtualenvs.create false && poetry install --no-dev
COPY . .

# Utiliza una imagen base más reciente de Python
FROM python:3.10.8-buster

# Instala las dependencias del sistema y elimina la caché
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libxft2:i386 \
    libfreetype6:i386 \
    libfontconfig1:i386 \
    libglib2.0-0:i386 \
    libsm6:i386 \
    libice6:i386 \
    libxrender1:i386 \
    libxext6:i386 \
    libgl1-mesa-glx:i386 \
    libgl1-mesa-dri:i386 \
    && rm -rf /var/lib/apt/lists/*
    

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos de proyecto e instala las dependencias del proyecto
COPY pyproject.toml poetry.lock ./
RUN pip install --upgrade pip && pip install poetry && poetry config virtualenvs.create false
RUN poetry install

# Copia los archivos restantes del proyecto
COPY . .

# Ejecuta los comandos de gestión de Django (collectstatic, migrate, createsuperuser)
RUN python manage.py migrate
RUN python manage.py createsuperuser

# Instala Gunicorn
RUN pip install gunicorn

# Expone el puerto necesario (ajusta según la configuración de Django)
EXPOSE 8000

# Inicia el servidor utilizando Gunicorn
CMD ["gunicorn", "liho.wsgi:application", "--bind", "0.0.0.0:8000"]

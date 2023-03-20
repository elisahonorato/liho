
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import ReactView



urlpatterns = [
    path('admin/', admin.site.urls),
    path('wel/', ReactView.as_view(), name="something"),
]

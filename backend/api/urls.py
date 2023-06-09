from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import PruebaView

router = DefaultRouter()
urlpatterns = [
    path('api/', include(router.urls)),
    path('probando/', PruebaView.as_view()),
]

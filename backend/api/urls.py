from django.urls import path
from .views import RoomView, CreateModel

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create_model/', CreateModel.as_view()),
]
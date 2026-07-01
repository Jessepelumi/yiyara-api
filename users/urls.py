from django.urls import path
from .views import InternalAuthView

urlpatterns = [
    path('auth/bridge/', InternalAuthView.as_view(), name='auth-bridge'),
]

from django.urls import path
from .views import DecomposeGoalView

urlpatterns = [
    path('decompose/', DecomposeGoalView.as_view(), name='decompose-goal')
]
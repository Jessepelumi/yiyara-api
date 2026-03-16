from django.urls import path
from .views import DecomposeGoalView, GoalListView

urlpatterns = [
    path('decompose/', DecomposeGoalView.as_view(), name='decompose-goal'),
    path('list/', GoalListView.as_view(), name="goal-list")
]
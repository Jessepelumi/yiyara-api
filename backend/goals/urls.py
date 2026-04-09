from django.urls import path
from .views import DecomposeGoalView, GoalListView, DeleteGoalView

urlpatterns = [
    path('decompose/', DecomposeGoalView.as_view(), name='decompose-goal'),
    path('list/', GoalListView.as_view(), name="goal-list"),
    path('<uuid:pk>/', DeleteGoalView.as_view(), name='goal-delete'),
]
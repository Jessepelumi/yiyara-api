from django.urls import path
from .views import (
    GoalListCreateView,
    GoalDetailView,
    InternalBulkTaskIngestionView,
    InternalGoalFailureView,
)

urlpatterns = [
    # Public API used by frontend
    path('goals/', GoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<uuid:pk>/', GoalDetailView.as_view(), name='goal-detail'),

    # Internal API used strictly by the Go decomposition engine
    path('internal/goals/<uuid:pk>/tasks/', InternalBulkTaskIngestionView.as_view(), name='internal-goal-tasks'),
    path('internal/goals/<uuid:pk>/failed/', InternalGoalFailureView.as_view(), name='internal-goal-failed'),
]
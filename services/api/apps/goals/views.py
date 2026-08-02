# import os
# import logging
# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.generics import ListAPIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from rest_framework import status, permissions
# from workflow import ai_engine
# from .serializers import GoalSerializer
# from .models import Goal

# logger = logging.getLogger(__name__)

# class DecomposeGoalView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         raw_input = request.data.get('text')

#         if not raw_input:
#             return Response(
#                 {"error": "No text provided"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Initialize workflow with Gemini key
#         api_key = os.environ.get('GEMINI_API_KEY')
#         workflow = ai_engine.YiyaraWorkflow(api_key=api_key)

#         try:
#             created_goals = workflow.create_goals_from_ai(request.user, raw_input)

#             # Check for clarification error
#             if isinstance(created_goals, list) and len(created_goals) > 0:
#                 if isinstance(created_goals[0], dict) and "error" in created_goals[0]:
#                     return Response(created_goals[0], status=status.HTTP_200_OK)

#             if not isinstance(created_goals, list):
#                 created_goals = [created_goals]
            
#             serializer = GoalSerializer(created_goals, many=True)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
        
#         except Exception as e:
#             return Response(
#                 {"error": "AI Processing Failed", "details": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

# class GoalListView(ListAPIView):
#     """
#     Returns a list of all goals and their nested tasks
#     for the authenticated user.
#     """

#     serializer_class = GoalSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Goal.objects.filter(user=self.request.user).prefetch_related('tasks').order_by('-created_at')
    
#     def list(self, request, *args, **kwargs):
#         try:
#             return super().list(request, *args, **kwargs)
#         except Exception as e:
#             logger.error(f"Error fetching goals for user {request.user.id}: {str(e)}")
#             return Response(
#                 {"error": "Failed to reterieve goals.", "details": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
        
# class DeleteGoalView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def delete(self, request, pk):
#         goal = get_object_or_404(Goal, pk=pk, user=request.user)
        
#         try:
#             goal.delete()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         except Exception as e:
#             logger.error(f"Error deleting goal {pk}: {str(e)}")
#             return Response(
#                 {"error": "Failed to delete goal"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
    

import os
import hmac
import logging

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Goal, GoalStatus
from .serializers import GoalSerializer, CreateGoalSerializer
from .services import trigger_decomposition, DecompositionTriggerError
from apps.api.apps.tasks.models import Task

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Public API (used by the frontend, behind normal user auth)
# ---------------------------------------------------------------------------

class GoalListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/goals/  -> Returns the user's goals with nested tasks
    POST /api/goals/  -> Creates a Goal in PROCESSING state and hands it to
                          the Go engine for decomposition.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateGoalSerializer
        return GoalSerializer

    def get_queryset(self):
        return (
            Goal.objects.filter(user=self.request.user)
            .prefetch_related('tasks')
            .order_by('-created_at')
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_input = serializer.validated_data['raw_input']
        title = raw_input[:60] + "..." if len(raw_input) > 60 else raw_input

        goal = Goal.objects.create(
            user=request.user,
            raw_input=raw_input,
            title=title,
            due_date=serializer.validated_data.get('due_date'),
            status=GoalStatus.PROCESSING,
        )

        try:
            trigger_decomposition(goal)
        except DecompositionTriggerError:
            logger.exception("Decomposition trigger failed for goal %s", goal.id)
            goal.status = GoalStatus.FAILED
            goal.save(update_fields=['status', 'updated_at'])
            # Still 201: the Goal resource exists. The client sees status=FAILED
            # and can offer the user a retry rather than getting a bare 500.

        return Response(GoalSerializer(goal).data, status=status.HTTP_201_CREATED)


class GoalDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/goals/<uuid:pk>/ -> Get single goal state (including tasks once ACTIVE)
    DELETE /api/goals/<uuid:pk>/ -> Delete goal and cascaded tasks
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GoalSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user).prefetch_related('tasks')


# ---------------------------------------------------------------------------
# Internal API (used strictly by the Go decomposition engine)
# ---------------------------------------------------------------------------

def _verify_internal_secret(request):
    server_secret = os.getenv("INTERNAL_AUTH_SECRET")
    client_secret = request.headers.get("X-Internal-Secret")
    return bool(server_secret) and bool(client_secret) and hmac.compare_digest(client_secret, server_secret)


class InternalBulkTaskIngestionView(APIView):
    """
    Internal API endpoint used strictly by the Go engine to save a computed
    task graph in a single DB transaction and mark the Goal ACTIVE.

    POST /internal/goals/<uuid:goal_id>/tasks/
    Body: {
        "title": "optional refined goal title",
        "description": "optional refined goal description",
        "tasks": [
            {"title": ..., "description": ..., "estimated_duration_minutes": ..., "order": ..., "parent_index": null},
            ...
        ]
    }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, goal_id):
        if not _verify_internal_secret(request):
            return Response({"error": "Unauthorized internal service call"}, status=status.HTTP_401_UNAUTHORIZED)

        goal = get_object_or_404(Goal, id=goal_id)

        # Idempotency guard: only accept ingestion once, while the goal is
        # actually waiting on it. Prevents duplicate task creation if the Go
        # engine retries a call that actually succeeded (timeout, at-least-once
        # delivery, etc.).
        if goal.status != GoalStatus.PROCESSING:
            return Response(
                {"error": f"Goal is in '{goal.status}' state, not PROCESSING. Ignoring duplicate ingestion."},
                status=status.HTTP_409_CONFLICT,
            )

        tasks_data = request.data.get("tasks", [])
        if not tasks_data:
            return Response({"error": "No tasks provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate up front so a bad payload fails cleanly instead of
        # half-constructing Task objects or hitting a DB-level NOT NULL error.
        for index, item in enumerate(tasks_data):
            if not item.get("title"):
                return Response(
                    {"error": f"tasks[{index}] is missing a required 'title'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            parent_index = item.get("parent_index")
            if parent_index is not None and not (0 <= parent_index < len(tasks_data)):
                return Response(
                    {"error": f"tasks[{index}].parent_index {parent_index} is out of range."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        refined_title = request.data.get("title")
        refined_description = request.data.get("description")

        with transaction.atomic():
            # First pass: create every task with no parent set yet, so we
            # have real primary keys available to wire up parent_index links.
            created = []
            for order, item in enumerate(tasks_data):
                created.append(Task.objects.create(
                    goal=goal,
                    title=item["title"],
                    description=item.get("description", ""),
                    estimated_duration_minutes=item.get("estimated_duration_minutes", 30),
                    order=item.get("order", order),
                ))

            # Second pass: wire up parent/subtask relationships, if the Go
            # engine sent a task graph rather than a flat list.
            to_update = []
            for item, task in zip(tasks_data, created):
                parent_index = item.get("parent_index")
                if parent_index is not None:
                    task.parent = created[parent_index]
                    to_update.append(task)
            if to_update:
                Task.objects.bulk_update(to_update, ['parent'])

            if refined_title:
                goal.title = refined_title
            if refined_description is not None:
                goal.description = refined_description
            goal.status = GoalStatus.ACTIVE
            goal.save(update_fields=['title', 'description', 'status', 'updated_at'])

        return Response(
            {"status": "success", "tasks_created": len(created)},
            status=status.HTTP_201_CREATED,
        )


class InternalGoalFailureView(APIView):
    """
    Called by the Go engine when decomposition fails (bad input, LLM error,
    timeout, etc.), so the goal doesn't hang in PROCESSING forever.

    POST /internal/goals/<uuid:goal_id>/failed/
    Body: {"reason": "optional human-readable error detail"}
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, goal_id):
        if not _verify_internal_secret(request):
            return Response({"error": "Unauthorized internal service call"}, status=status.HTTP_401_UNAUTHORIZED)

        goal = get_object_or_404(Goal, id=goal_id)

        if goal.status != GoalStatus.PROCESSING:
            # Already resolved one way or another — don't clobber a good result.
            return Response(
                {"error": f"Goal is in '{goal.status}' state, not PROCESSING. Ignoring."},
                status=status.HTTP_409_CONFLICT,
            )

        reason = request.data.get("reason", "")
        if reason:
            logger.warning("Decomposition failed for goal %s: %s", goal.id, reason)

        goal.status = GoalStatus.FAILED
        goal.save(update_fields=['status', 'updated_at'])

        return Response({"status": "acknowledged"}, status=status.HTTP_200_OK)

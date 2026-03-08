from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from workflow import ai_engine
from .serializers import GoalSerializer
import os

class DecomposeGoalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_input = request.data.get('text')

        if not raw_input:
            return Response(
                {"error": "No text provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Initialize workflow with Gemini key
        api_key = os.environ.get('GEMINI_API_KEY')
        workflow = ai_engine.ZimnaWorkflow(api_key=api_key)

        try:
            created_goals = workflow.create_goals_from_ai(request.user, raw_input)

            # Check for clarification error
            if isinstance(created_goals, list) and len(created_goals) > 0:
                if isinstance(created_goals[0], dict) and "error" in created_goals[0]:
                    return Response(created_goals[0], status=status.HTTP_200_OK)

            if not isinstance(created_goals, list):
                created_goals = [created_goals]
            
            serializer = GoalSerializer(created_goals, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {"error": "AI Processing Failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

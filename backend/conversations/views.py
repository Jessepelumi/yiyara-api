from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import MessageSerializer
from .services import handle_zimna_logic
from goals.models import Goal

class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        raw_text = request.data.get('content')
        goal_id = request.data.get('goal_id')
        conversation_id = request.data.get('conversation_id')

        if not raw_text:
            return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get or Create the Conversation
        if conversation_id:
            conversation = get_object_or_404(Conversation, id=conversation_id, user=user)
        elif goal_id:
            goal = get_object_or_404(Goal, id=goal_id, user=user)
            conversation, created = Conversation.objects.get_or_create(
                goal=goal, 
                user=user
            )
        else:
            return Response({"error": "Goal ID or Conversation ID required"}, status=status.HTTP_400_BAD_REQUEST)

        # Process logic (Classification -> Action -> Response)
        try:
            ai_message = handle_zimna_logic(user, conversation, raw_text)
            
            # Return the response with the conversation_id 
            # so the frontend can "lock in" this chat thread
            return Response({
                "conversation_id": conversation.id,
                "message": MessageSerializer(ai_message).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
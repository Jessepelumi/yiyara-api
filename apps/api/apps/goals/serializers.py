from rest_framework import serializers
from .models import Goal
from tasks.serializers import TaskSerializers

class GoalSerializer(serializers.ModelSerializer):
    """Full read representation, including nested tasks once decomposition completes."""
    tasks = TaskSerializers(many=True, read_only=True)

    class Meta:
        model = Goal
        fields = [
            'id',
            'title',
            'description',
            'raw_input',
            'status',
            'due_date',
            'is_completed',
            'task_count',
            'created_at',
            'updated_at',
            'tasks',
        ]
        read_only_fields = [
            'id',
            'title',
            'description',
            'status',
            'is_completed',
            'created_at',
            'updated_at',
            'tasks',
        ]

class CreateGoalSerializer(serializers.Serializer):
    raw_input = serializers.CharField(required=True, min_length=3, trim_whitespace=True)
    due_date = serializers.DateField(required=False, allow_null=True)

    def validate_raw_input(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("raw_input cannot be blank.")
        return value
        
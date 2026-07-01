from django.contrib import admin
from .models import Goal

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = (
        'title', 
        'user', 
        'due_date', 
        'is_completed', 
        'created_at'
    )

    list_filter = (
        'is_completed', 
        'due_date'
    )

    search_fields = (
        'title', 
        'description', 
        'user__email'
    )
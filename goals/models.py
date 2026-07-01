import uuid
from django.db import models
from django.conf import settings # to link to User model

class Goal(models.Model):

    # use UUID as primary key
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )

    # link each goal to a user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='goals'
    )

    # system-generated title & description
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # smartified input from AI layer
    raw_input = models.TextField(blank=True)

    # optional due date
    due_date = models.DateField(
        null=True, 
        blank=True, 
        db_index=True
    )

    # completion status
    is_completed = models.BooleanField(default=False)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # goal ordering
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

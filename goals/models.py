import uuid
from django.db import models
from django.conf import settings

class GoalStatus(models.TextChoices):
    DRAFT = 'DRAFT', "Draft"
    PROCESSING = 'PROCESSING', 'Processing Decomposition'
    FAILED = 'FAILED', 'Decomposition Failed'
    ACTIVE = 'ACTIVE', 'Active'
    COMPLETED = 'COMPLETED', 'Completed'
    ARCHIVED = 'ARCHIVED', 'Archived'

class Goal(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='goals'
    )

    # Generated or refined title & description
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Unparsed initial prompt/prompt state submitted by the user
    raw_input = models.TextField(blank=True)

    # Goal Status Lifecycle
    status = models.CharField(
        max_length=20, 
        choices=GoalStatus.choices, 
        default=GoalStatus.DRAFT,
        db_index=True
    )

    # Target due date
    due_date = models.DateField(
        null=True, 
        blank=True, 
        db_index=True
    )

    is_completed = models.BooleanField(default=False, db_index=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'is_completed']),
        ]

    def save(self, *args, **kwargs):
        self.is_completed = (self.status == GoalStatus.COMPLETED)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.user.email})"

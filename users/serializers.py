from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# Public User Profile Serializer (For frontend dashboards)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'gender',
            'is_email_verified',
            'calendar_sync_enabled',
            'date_joined'
        ]
        read_only_fields = ['id', 'email', 'is_email_verified', 'date_joined']

# Registration Serializer (Validates input when creating account via email/password)
class RegisterSerializer(serializers.ModelSerializer):
    passwords = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'gender']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
        
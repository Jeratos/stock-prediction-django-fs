# pyrefly: ignore [missing-import]
from rest_framework import serializers,exceptions
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
# pyrefly: ignore [missing-import]
from django.contrib.auth import authenticate
# pyrefly: ignore [missing-import]
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# pyrefly: ignore [missing-import]
from rest_framework_simplejwt.settings import api_settings

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Set the input field to 'email' instead of Django's default 'username'
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff

        return token

    def validate(self, attrs):
        # Retrieve email and password sent by the frontend react application
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            # Query the database to find the user associated with the provided email (case-insensitive)
            user = User.objects.get(email__iexact=email)
            # Retrieve their actual username because standard Django authentication expects a username
            username = user.username
        except User.DoesNotExist:
            # If the user doesn't exist, set username to None so authenticate() fails safely
            username = None

        # Authenticate using standard Django credentials (username and password)
        self.user = authenticate(username=username, password=password)

        # Check if the user is authenticated and is active
        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )

        # Generate simplejwt token payload (access & refresh tokens) for the authenticated user
        data = {}
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model = User 
        fields = ['username', 'email', 'password','first_name','last_name','is_staff']
    # User.objects.create= save the password in plain text 
    # User.objects.create_user= save the password in encrypted format
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_staff=validated_data['is_staff']
        )
        # user=user.objects.create_user(**validated_data)
        return user

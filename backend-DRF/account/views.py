# pyrefly: ignore [missing-import]
from rest_framework import generics
from .serializers import UserSerializer, EmailTokenObtainPairSerializer
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
# pyrefly: ignore [missing-import]
from rest_framework.permissions import AllowAny, IsAuthenticated
# pyrefly: ignore [missing-import]
from rest_framework_simplejwt.views import TokenObtainPairView

# pyrefly: ignore [missing-import]
from rest_framework.views import APIView
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
# Create your views here.

class RegisterView(generics.ListCreateAPIView):
    """
    API View to register a new user
    Endpoint: /api/v1/auth/register/
    Method: POST
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class EmailTokenObtainPairView(TokenObtainPairView):
    """
    API View to authenticate using email and password
    Endpoint: /api/v1/auth/token/
    Method: POST
    """
    serializer_class = EmailTokenObtainPairSerializer

class ProtectedView(APIView):
    """
    API View to get the protected data
    Endpoint: /api/v1/protected-view/
    Method: GET
    """
    # queryset = User.objects.all()
    # serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]    

    def get(self, request):
        # pyrefly: ignore [attr-defined]
        return Response({
            "message": "Protected data",
            "user": UserSerializer(request.user).data,
            "data":"this stock prediction application utilizes machine learning techniques, apecifically employing Keras and LSTM model, integrated within the Django framework. it forecast future proce by analyzing 100-day and 200-day moving averages, essential indicator widly used by stock analyst to inform trading and investment decisions.",
            
        })

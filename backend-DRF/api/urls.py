# pyrefly: ignore [missing-import]
from django.urls import path
# pyrefly: ignore [missing-import]
from account.views import RegisterView, EmailTokenObtainPairView, ProtectedView
# pyrefly: ignore [missing-import]
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-view/', ProtectedView.as_view())
]
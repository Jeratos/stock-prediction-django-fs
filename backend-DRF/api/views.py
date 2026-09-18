# # pyrefly: ignore [missing-import]
# from rest_framework import generics
# # pyrefly: ignore [missing-import]
# from django.contrib.auth.models import User
# # pyrefly: ignore [missing-import]
# from account.serializers import UserSerializer
# # pyrefly: ignore [missing-import]
# from rest_framework.permissions import AllowAny
# # pyrefly: ignore [missing-import]
# from rest_framework.response import Response
# # pyrefly: ignore [missing-import]
# from rest_framework import status

# class RegisterView(generics.ListCreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)
#     def perform_create(self, serializer):
#         user=serializer.save()
#         return Response(user, status=status.HTTP_201_CREATED)

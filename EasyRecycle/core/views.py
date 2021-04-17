from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import generics, permissions, exceptions
from rest_framework.response import Response
from rest_framework.views import APIView

from core.mixins import UpdateUserModelMixin, APIViewValidationMixin
from core.models import UserModel
from core.serializers import (
	UserDetailsSerializer, EditSelfUserSerializer, EditSelfUserAvatarSerializer
)
from core.validators import RequiredValidator, PasswordValidator


# /api/v1/core/users/<pk>
# path args:
#   - pk <int>: primary key of user object
# methods:
#   - get
# returns (success status - 200):
#   {
#       "id": <int>,
#       "first_name": <string>,
#       "last_name": <string>,
#       "username": <string>,
#       "email": <string>,
#       "avatar_link": <string (full url)>,
#       "rating": <int>,
#       "is_superuser": <bool>,
#       "is_banned": <bool>,
#       "is_garbage_collector": <bool>,
#       "is_commercial": <bool>,
#       "show_full_name": <bool>
#   }
class UserDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = UserModel.objects.all()
	serializer_class = UserDetailsSerializer


# /api/v1/core/users/self/edit
# methods:
#   - put:
#       - first_name: string
#       - last_name: string
#       - show_full_name: bool
# returns (success status - 200):
#   {
#       "first_name": <string>,
#       "last_name": <string>,
#       "show_full_name": <bool>
#   }
class EditSelfAPIView(APIView, UpdateUserModelMixin):
	serializer_class = EditSelfUserSerializer


# /api/v1/core/users/self/edit/avatar
# methods:
#   - put (Content-Type must be `multipart/form-data`):
#       - avatar: image
# returns (success status - 200):
#   {
#       "avatar_link": <string> (full url)
#   }
class EditSelfAvatarAPIView(APIView, UpdateUserModelMixin):
	serializer_class = EditSelfUserAvatarSerializer


# /api/v1/core/users/self/edit/email
# methods:
#   - put
#       - email: string
#       - password: string
# returns (success status - 200):
#   {
#       "email": <string>
#   }
class EditSelfEmailAPIView(APIView, UpdateUserModelMixin, APIViewValidationMixin):
	validators = (
		RequiredValidator(fields=('email', 'password')),
	)

	def update(self, request, *args, **kwargs):
		validated_data = self.validate_data(request)
		if isinstance(validated_data, exceptions.ValidationError):
			return Response({'detail': validated_data.detail}, status=validated_data.status_code)

		instance = self.get_object()
		if not instance.check_password(validated_data['password']):
			raise exceptions.NotAuthenticated('Password is incorrect.')

		email = validated_data['email']
		try:
			validate_email(email)
		except ValidationError:
			raise exceptions.ValidationError('Email is not valid.')

		instance.email = email
		instance.save()
		return Response(data={'email': email}, status=200)


# /api/v1/core/users/self/edit/password
# methods:
#   - put
#       - old_password: string
#       - new_password: string
# returns (success status - 200):
#   {}
class EditSelfPasswordAPIView(APIView, UpdateUserModelMixin, APIViewValidationMixin):
	validators = (
		RequiredValidator(fields=('old_password', 'new_password')),
		PasswordValidator(password_key='new_password')
	)

	def put(self, request, *args, **kwargs):
		validated_data = self.validate_data(request)
		if isinstance(validated_data, exceptions.ValidationError):
			return Response({'detail': validated_data.detail}, status=validated_data.status_code)

		user = self.get_object()
		if not user.check_password(validated_data['old_password']):
			raise exceptions.ValidationError('Current password is incorrect.')

		user.set_password(validated_data['new_password'])
		user.save()
		return Response(status=200)


# /api/v1/core/users/self/deactivate
# methods:
#   - put
#       - password: string
# returns (success status - 200):
#   {}
class DeactivateSelfAPIView(APIView, UpdateUserModelMixin, APIViewValidationMixin):
	validators = (
		RequiredValidator(fields=('password',)),
	)

	def put(self, request, *args, **kwargs):
		result = self.validate_data(request)
		if isinstance(result, exceptions.ValidationError):
			raise result

		validated_data = result
		user = self.get_object()
		if not user.check_password(validated_data['password']):
			raise exceptions.ValidationError('Password is incorrect.')

		if not user.is_active:
			raise exceptions.ValidationError('Account is already deactivated')

		user.is_active = False
		user.save()
		return Response(status=200)


# /api/v1/core/users/self
# methods:
#   - get
# returns (success status - 200):
#   {
#       "id": <int>,
#       "first_name": <string>,
#       "last_name": <string>,
#       "username": <string>,
#       "email": <string>,
#       "avatar_link": <string (full url)>,
#       "rating": <int>,
#       "is_superuser": <bool>,
#       "is_garbage_collector": <bool>,
#       "is_commercial": <bool>
#   }
class SelfUserAPIView(generics.RetrieveAPIView):
	serializer_class = UserDetailsSerializer
	queryset = UserModel.objects.all()

	def get_object(self):
		return self.request.user

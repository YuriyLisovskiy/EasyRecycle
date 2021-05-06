import random
from rest_framework import serializers

from core.models import UserModel
from core.validators import (
	RequiredValidator, UsernameValidator, PasswordValidator
)


class RegisterUserSerializer(serializers.ModelSerializer):
	avatar_info = serializers.SerializerMethodField()

	def get_avatar_info(self, obj):
		if obj.avatar_info:
			pixels, color = obj.avatar_info.split('#')
		else:
			pixels, color = '1010101010101010101010101', '000000'
		return {
			'pixels': [int(x) for x in pixels],
			'color': '#{}'.format(color)
		}

	def create(self, validated_data):
		password = validated_data.pop('password', None)
		pixels = ''.join([str(random.randint(0, 10)) for _ in range(25)])
		validated_data['avatar_info'] = '{}#{}'.format(
			pixels,
			str(hex(random.randint(0, 16777215))).lstrip('0x')
		)
		instance = self.Meta.model(**validated_data)
		if password is not None:
			instance.set_password(password)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		fields = (
			'id', 'username', 'email', 'password', 'first_name',
			'last_name', 'avatar_info', 'is_superuser', 'rating'
		)
		read_only_fields = (
			'id', 'first_name', 'last_name', 'avatar_info', 'rating', 'is_superuser'
		)
		extra_kwargs = {
			'password': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('username', 'email', 'password')),
			UsernameValidator(),
			PasswordValidator()
		]

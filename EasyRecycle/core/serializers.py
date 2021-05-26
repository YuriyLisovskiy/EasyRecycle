from rest_framework import serializers

from core.models import UserModel
from core.validators import AvatarFormatValidator


class UserDetailsSerializer(serializers.ModelSerializer):
	avatar_info = serializers.SerializerMethodField()
	is_banned = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(UserDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

	def _is_authenticated(self):
		request = self.context.get('request', None)
		return request and request.user.is_authenticated, request

	def get_avatar_info(self, obj):
		if obj.avatar_info:
			pixels, color = obj.avatar_info.split('#')
		else:
			pixels, color = '1010101010101010101010101', '000000'
		return {
			'pixels': [int(x) for x in pixels],
			'color': '#{}'.format(color)
		}

	@staticmethod
	def get_is_banned(obj):
		return not obj.is_active

	class Meta:
		model = UserModel
		fields = (
			'id', 'first_name', 'last_name', 'username', 'email',
			'avatar_info', 'is_superuser', 'rating', 'is_banned',
			'is_garbage_collector', 'is_commercial', 'show_full_name',
		)


class EditSelfUserSerializer(serializers.ModelSerializer):

	class Meta:
		model = UserModel
		fields = (
			'first_name', 'last_name', 'show_full_name',
		)


class EditSelfUserAvatarSerializer(serializers.ModelSerializer):
	avatar_info = serializers.CharField(max_length=32)

	class Meta:
		model = UserModel
		fields = (
			'avatar_info',
		)
		extra_kwargs = {
			'avatar_info': {'write_only': True}
		}
		validators = (
			AvatarFormatValidator(),
		)

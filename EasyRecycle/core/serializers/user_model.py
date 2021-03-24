from rest_framework import serializers

from core.models import UserModel
from core.utils import build_full_url


class UserDetailsSerializer(serializers.ModelSerializer):
	avatar_link = serializers.SerializerMethodField()
	is_banned = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(UserDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

	def _is_authenticated(self):
		request = self.context.get('request', None)
		return request and request.user.is_authenticated, request

	def get_avatar_link(self, obj):
		return build_full_url(
			self.context.get('request', None),
			obj.avatar
		)

	@staticmethod
	def get_is_banned(obj):
		return not obj.is_active

	class Meta:
		model = UserModel
		fields = (
			'id', 'first_name', 'last_name', 'username', 'email',
			'avatar_link', 'is_superuser', 'rating', 'is_banned',
			'is_garbage_collector', 'show_full_name', 'show_rating',
		)


class EditSelfUserSerializer(serializers.ModelSerializer):

	class Meta:
		model = UserModel
		fields = (
			'first_name', 'last_name', 'show_full_name', 'show_rating',
		)


class EditSelfUserAvatarSerializer(serializers.ModelSerializer):
	avatar_link = serializers.SerializerMethodField()

	def get_avatar_link(self, obj):
		return build_full_url(
			self.context.get('request', None),
			obj.avatar
		)

	class Meta:
		model = UserModel
		fields = (
			'avatar', 'avatar_link'
		)
		read_only_fields = ('avatar_link',)
		extra_kwargs = {
			'avatar': {'write_only': True}
		}

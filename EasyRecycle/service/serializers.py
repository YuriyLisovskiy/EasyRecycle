from rest_framework import serializers

from service.models import Location
from service.validators import IsGarbageCollectorValidator


class LocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	owner_id = serializers.SerializerMethodField()

	@staticmethod
	def get_owner_id(obj):
		return obj.owner.id

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'owner_id'
		)


class CreateLocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'owner'
		)
		validators = (
			IsGarbageCollectorValidator('owner'),
		)


class EditLocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'owner'
		)
		validators = (
			IsGarbageCollectorValidator('owner'),
		)
		extra_kwargs = {
			'address': {'required': False},
			'open_time': {'required': False},
			'close_time': {'required': False},
			'owner': {'required': False}
		}

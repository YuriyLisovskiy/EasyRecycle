from rest_framework import serializers

from service.models import Location


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


class ManageLocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'owner'
		)

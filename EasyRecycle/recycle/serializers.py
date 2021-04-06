from rest_framework import serializers

from recycle.models import Location, Service, CommercialRequest
from recycle.validators import IsGarbageCollectorValidator, IsCommercialValidator


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


class ServiceSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	location_id = serializers.SerializerMethodField()

	@staticmethod
	def get_location_id(obj):
		return obj.owner.id

	class Meta:
		model = Service
		fields = (
			'id', 'garbage_type', 'service_name', 'price_per_kg', 'location_id'
		)


class CreateServiceSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = Service
		fields = (
			'id', 'garbage_type', 'service_name', 'price_per_kg', 'location'
		)


class EditServiceSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = Service
		fields = (
			'id', 'garbage_type', 'service_name', 'price_per_kg', 'location'
		)
		extra_kwargs = {
			'garbage_type': {'required': False},
			'service_name': {'required': False},
			'price_per_kg': {'required': False},
			'location': {'required': False}
		}


class CommercialRequestSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	service_id = serializers.SerializerMethodField()
	user_id = serializers.SerializerMethodField()

	@staticmethod
	def get_service_id(obj):
		return obj.service.id if obj.service else -1

	@staticmethod
	def get_user_id(obj):
		return obj.user.id if obj.user else -1

	class Meta:
		model = CommercialRequest
		fields = (
			'id', 'date', 'garbage_type', 'status', 'service_id', 'user_id'
		)


class CreateCommercialRequestSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = CommercialRequest
		fields = (
			'id', 'date', 'garbage_type', 'status', 'service', 'user'
		)
		validators = (
			IsCommercialValidator('user'),
		)


class EditCommercialRequestSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = CommercialRequest
		fields = (
			'id', 'date', 'garbage_type', 'status', 'service', 'user'
		)
		validators = (
			IsCommercialValidator('user'),
		)
		extra_kwargs = {
			'date': {'required': False},
			'garbage_type': {'required': False},
			'status': {'required': False},
			'service': {'required': False},
			'user': {'required': False}
		}

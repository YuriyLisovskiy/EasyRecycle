from rest_framework import serializers

from recycle.models import Location, CommercialRequest, Transaction
from recycle.validators import IsGarbageCollectorValidator, IsCommercialValidator


class LocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	open_time = serializers.SerializerMethodField()
	close_time = serializers.SerializerMethodField()
	owner_id = serializers.SerializerMethodField()
	garbage_types = serializers.SerializerMethodField()

	@staticmethod
	def get_open_time(obj):
		return obj.open_time.strftime('%H:%M')

	@staticmethod
	def get_close_time(obj):
		return obj.close_time.strftime('%H:%M')

	@staticmethod
	def get_owner_id(obj):
		return obj.owner.id

	@staticmethod
	def get_garbage_types(obj):
		return [{
			'short': gt.garbage_type,
			'long': gt.get_garbage_type_display()
		} for gt in obj.garbagetype_set.all()]

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'price_per_kg', 'garbage_types', 'owner_id'
		)


class CreateLocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	garbage_types = serializers.ListField(required=False)

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'price_per_kg', 'garbage_types', 'owner'
		)
		validators = (
			IsGarbageCollectorValidator('owner'),
		)


class EditLocationSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	garbage_types = serializers.ListField(required=False)

	class Meta:
		model = Location
		fields = (
			'id', 'address', 'open_time', 'close_time', 'price_per_kg', 'garbage_types', 'owner'
		)
		validators = (
			IsGarbageCollectorValidator('owner'),
		)
		extra_kwargs = {
			'address': {'required': False},
			'open_time': {'required': False},
			'close_time': {'required': False},
			'price_per_kg': {'required': False},
			'garbage_types': {'required': False},
			'owner': {'required': False}
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
			'id', 'date', 'garbage_type', 'mass', 'status', 'service_id', 'user_id'
		)


class CreateCommercialRequestSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = CommercialRequest
		fields = (
			'id', 'date', 'garbage_type', 'mass', 'status', 'service', 'user'
		)
		validators = (
			IsCommercialValidator('user'),
		)


class EditCommercialRequestSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()

	class Meta:
		model = CommercialRequest
		fields = (
			'id', 'date', 'garbage_type', 'mass', 'status', 'service', 'user'
		)
		validators = (
			IsCommercialValidator('user'),
		)
		extra_kwargs = {
			'date': {'required': False},
			'garbage_type': {'required': False},
			'mass': {'required': False},
			'status': {'required': False},
			'service': {'required': False},
			'user': {'required': False}
		}


class TransactionSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	user_id = serializers.SerializerMethodField()
	collector_id = serializers.SerializerMethodField()

	@staticmethod
	def get_user_id(obj):
		return obj.user.id if obj.user else -1

	@staticmethod
	def get_collector_id(obj):
		return obj.collector.id if obj.collector else -1

	class Meta:
		model = Transaction
		fields = (
			'id', 'datetime', 'garbage_type', 'mass', 'points', 'user_id', 'collector_id'
		)


class CreateTransactionSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	datetime = serializers.ReadOnlyField()

	class Meta:
		model = Transaction
		fields = (
			'id', 'datetime', 'garbage_type', 'mass', 'points', 'user', 'collector'
		)
		validators = (
			IsGarbageCollectorValidator('collector'),
		)

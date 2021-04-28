from rest_framework import generics, permissions, status
from rest_framework.response import Response

from recycle import garbage
from recycle.models import Location, GarbageType
from recycle.serializers import LocationSerializer, CreateLocationSerializer, EditLocationSerializer


# /api/v1/recycle/locations
# methods:
#   - get
# returns (success status - 200):
#   [
#     {
#       "id": <int>,
#       "address": <string>,
#       "open_time": <string>,
#       "close_time": <string>,
#       "owner_id": <int>
#     },
#     ...
#   ]
class LocationsAPIView(generics.ListAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Location.objects.order_by('address')
	serializer_class = LocationSerializer


# /api/v1/recycle/locations/<pk>
# path args:
#   - pk <int>: primary key of location object
# methods:
#   - get
# returns (success status - 200):
#   {
#     "id": <int>,
#     "address": <string>,
#     "open_time": <string>,
#     "close_time": <string>,
#     "owner_id": <int>
#   }
class LocationDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Location.objects.all()
	serializer_class = LocationSerializer


# /api/v1/recycle/locations/create
# methods:
#   - post:
#       - address: string
#       - open_time: string
#       - close_time: string
#       - owner: int
# returns (success status - 201):
#   {
#     "id": <int>,
#     "address": <string>,
#     "open_time": <string>,
#     "close_time": <string>,
#     "owner": <int>
#   }
class CreateLocationAPIView(generics.CreateAPIView):
	permission_classes = (permissions.IsAdminUser,)
	queryset = Location.objects.all()
	serializer_class = CreateLocationSerializer

	def create(self, request, *args, **kwargs):
		if 'garbage_types' not in request.data:
			return Response(
				{'message': '"garbage_types" parameter is required'},
				status=status.HTTP_400_BAD_REQUEST
			)

		data = request.data.copy()
		garbage_types = data.pop('garbage_types')
		serializer = self.get_serializer(data=data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)

		for g_type in garbage_types:
			if g_type not in garbage.SHORT_TYPES:
				return Response(
					{'message': 'invalid garbage type: {}'.format(g_type)},
					status=status.HTTP_400_BAD_REQUEST
				)

			GarbageType.objects.create(garbage_type=g_type, location_id=serializer.data['id'])

		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# /api/v1/recycle/locations/<pk>/manage
# path args:
#   - pk <int>: primary key of location object
# methods:
#   - put:
#       - address: string
#       - open_time: string
#       - close_time: string
#       - owner: int
#   - delete
# returns (success status: 204 (on delete), 200 (on update)):
#   {
#     "id": <int>,
#     "address": <string>,
#     "open_time": <string>,
#     "close_time": <string>,
#     "owner": <int>
#   }
class ManageLocationAPIView(generics.UpdateAPIView, generics.DestroyAPIView):
	permission_classes = (permissions.IsAdminUser,)
	queryset = Location.objects.all()
	serializer_class = EditLocationSerializer

	def update(self, request, *args, **kwargs):
		data = request.data.copy()
		garbage_types = data.pop('garbage_types', [])
		for g_type in garbage_types:
			if g_type not in garbage.SHORT_TYPES:
				return Response(
					{'message': 'invalid garbage type: {}'.format(g_type)},
					status=status.HTTP_400_BAD_REQUEST
				)

		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=data, partial=partial)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)

		current_g_types = instance.garbagetype_set.all()
		for g_type in current_g_types:
			if g_type.garbage_type in garbage_types:
				garbage_types.remove(g_type.garbage_type)
			else:
				g_type.delete()

		for new_g_type in garbage_types:
			GarbageType.objects.create(garbage_type=new_g_type, location=instance)

		if getattr(instance, '_prefetched_objects_cache', None):
			# If 'prefetch_related' has been applied to a queryset, we need to
			# forcibly invalidate the prefetch cache on the instance.
			instance._prefetched_objects_cache = {}

		return Response(serializer.data)

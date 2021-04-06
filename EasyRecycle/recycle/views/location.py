from rest_framework import generics, permissions

from recycle.models import Location
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

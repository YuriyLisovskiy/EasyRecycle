from rest_framework import generics, permissions

from service.models import Location
from service.serializers import LocationSerializer, ManageLocationSerializer


# /api/v1/service/locations
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
	queryset = Location.objects.all()
	serializer_class = LocationSerializer


# /api/v1/service/locations/<pk>
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


# /api/v1/service/locations/create
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
	serializer_class = ManageLocationSerializer


# /api/v1/service/locations/<pk>/manage
# path args:
#   - pk <int>: primary key of location object
# methods:
#   - put:
#       - address: string
#       - open_time: string
#       - close_time: string
#       - owner: int
#   - delete
# returns (success status: 200 (on update), 201 (on delete)):
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
	serializer_class = ManageLocationSerializer

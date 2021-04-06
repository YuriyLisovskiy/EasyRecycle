from rest_framework import generics, permissions

from recycle.models import Service
from recycle.serializers import ServiceSerializer, CreateServiceSerializer, EditServiceSerializer


# /api/v1/recycle/services
# methods:
#   - get
# returns (success status - 200):
#   [
#     {
#       "id": <int>,
#       "garbage_type_name": <string>,
#       "service_name": <string>,
#       "price_per_kg": <float>,
#       "location_id": <int>
#     },
#     ...
#   ]
class ServicesAPIView(generics.ListAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Service.objects.order_by('location')
	serializer_class = ServiceSerializer


# /api/v1/recycle/services/<pk>
# path args:
#   - pk <int>: primary key of Service object
# methods:
#   - get
# returns (success status - 200):
#   {
#     "id": <int>,
#     "garbage_type_name": <string>,
#     "service_name": <string>,
#     "price_per_kg": <float>,
#     "location_id": <int>
#   }
class ServiceDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Service.objects.all()
	serializer_class = ServiceSerializer


# /api/v1/recycle/services/create
# methods:
#   - post:
#       - garbage_type: string
#       - service_name: string
#       - price_per_kg: float
#       - location: int
# returns (success status - 201):
#   {
#     "id": <int>,
#     "garbage_type": <string>,
#     "service_name": <string>,
#     "price_per_kg": <float>,
#     "location": <int>
#   }
class CreateServiceAPIView(generics.CreateAPIView):
	permission_classes = (permissions.IsAdminUser,)
	queryset = Service.objects.all()
	serializer_class = CreateServiceSerializer


# /api/v1/recycle/services/<pk>/manage
# path args:
#   - pk <int>: primary key of Service object
# methods:
#   - put:
#       - garbage_type: string
#       - service_name: string
#       - price_per_kg: float
#       - location: int
#   - delete
# returns (success status: 204 (on delete), 200 (on update)):
#   {
#     "id": <int>,
#     "garbage_type": <string>,
#     "service_name": <string>,
#     "price_per_kg": <float>,
#     "location": <int>
#   }
class ManageServiceAPIView(generics.UpdateAPIView, generics.DestroyAPIView):
	permission_classes = (permissions.IsAdminUser,)
	queryset = Service.objects.all()
	serializer_class = EditServiceSerializer

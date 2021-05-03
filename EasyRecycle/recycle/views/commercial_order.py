from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from recycle.models import CommercialRequest, Location
from recycle.permissions import IsCommercialUser, IsGarbageCollector
from recycle.serializers import (
	CommercialOrderSerializer, CreateCommercialOrderSerializer, EditCommercialOrderSerializer
)


_PERMISSION_CLASSES = (permissions.IsAuthenticated & (
	IsCommercialUser | permissions.IsAdminUser | IsGarbageCollector
),)


# /api/v1/recycle/commercial-requests
# methods:
#   - get:
#       - user_pk: int (for superusers and garbage collectors only)
#       - service_pk: int (for superusers and garbage collectors only)
# returns (success status - 200):
#   [
#     {
#       "id": <int>,
#       "address": <string>,
#       "email": <string>,
#       "date": <string>,
#       "garbage_type": <string>,
#       "mass": <float>,
#       "status": <string>,
#       "service_id": <int>,
#       "user_id": <int>
#     },
#     ...
#   ]
class CommercialOrdersAPIView(generics.ListAPIView):
	permission_classes = _PERMISSION_CLASSES
	queryset = CommercialRequest.objects.all()
	serializer_class = CommercialOrderSerializer

	def get_queryset(self):
		queryset = super().get_queryset()
		order_by = []
		if self.request.query_params.get('order_by_status', 'false').lower() == 'true':
			order_by.append('status')

		order_by.append('date')
		queryset = queryset.order_by(*order_by)

		if self.request.user.is_superuser or self.request.user.is_garbage_collector:
			user_pk = self.request.query_params.get('user_pk')
			if user_pk is not None:
				try:
					queryset = queryset.filter(user_id=int(user_pk))
				except ValueError:
					pass

			by_location = self.request.query_params.get('location', 'false').lower() == 'true'
			if by_location:
				location = Location.objects.filter(owner_id=self.request.user.id).first()
				queryset = queryset.filter(location_id=location.id)

			by_status = self.request.query_params.getlist('status', None)
			if by_status:
				queryset = queryset.filter(status__in=by_status)

			return queryset

		return queryset.filter(user=self.request.user)


# /api/v1/recycle/commercial-requests/<pk>
# path args:
#   - pk <int>: primary key of CommercialRequest object
# methods:
#   - get
# returns (success status - 200):
#   {
#     "id": <int>,
#     "address": <string>,
#     "email": <string>,
#     "date": <string>,
#     "garbage_type": <string>,
#     "mass": <float>,
#     "status": <string>,
#     "service_id": <int>,
#     "user_id": <int>
#   }
class CommercialOrderDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = _PERMISSION_CLASSES
	queryset = CommercialRequest.objects.all()
	serializer_class = CommercialOrderSerializer

	def get_object(self):
		obj = super().get_object()
		is_sudo_or_gc = self.request.user.is_superuser or self.request.user.is_garbage_collector
		if is_sudo_or_gc or obj.user.pk == self.request.user.pk:
			return obj

		raise NotFound


# /api/v1/recycle/commercial-requests/create
# methods:
#   - post:
#       - address: string
#       - date: string
#       - garbage_type: string
#       - mass: float
#       - status: string
#       - service: int
#       - user: int
# returns (success status - 201):
#   {
#     "id": <int>,
#     "address": <string>,
#     "date": <string>,
#     "garbage_type": <string>,
#     "mass": <float>,
#     "status": <string>,
#     "service": <int>,
#     "user": <int>
#   }
class CreateCommercialOrderAPIView(generics.CreateAPIView):
	permission_classes = (permissions.IsAuthenticated & (IsCommercialUser | permissions.IsAdminUser),)
	queryset = CommercialRequest.objects.all()
	serializer_class = CreateCommercialOrderSerializer


# /api/v1/recycle/commercial-requests/<pk>/edit
# path args:
#   - pk <int>: primary key of CommercialRequest object
# methods:
#   - put:
#       - address: string
#       - date: string
#       - garbage_type: string
#       - mass: float
#       - status: string
#       - service: int
#       - user: int
# returns (success status: 200 (on update)):
#   {
#     "id": <int>,
#     "address": <string>,
#     "date": <string>,
#     "garbage_type": <string>,
#     "mass": <float>,
#     "status": <string>,
#     "service": <int>,
#     "user": <int>
#   }
class EditCommercialOrderAPIView(generics.UpdateAPIView):
	permission_classes = (permissions.IsAuthenticated & (IsGarbageCollector | permissions.IsAdminUser),)
	queryset = CommercialRequest.objects.all()
	serializer_class = EditCommercialOrderSerializer

	def update(self, request, *args, **kwargs):
		if not request.user.is_superuser:
			data = dict()
			if 'status' in request.data:
				data['status'] = request.data['status']
		else:
			data = request.data

		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		if instance.status in ['R', 'D']:
			return Response(data={
				'message': 'unable to change status for rejected and done orders'
			}, status=400)

		serializer = self.get_serializer(instance, data=data, partial=partial)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)

		if getattr(instance, '_prefetched_objects_cache', None):
			# If 'prefetch_related' has been applied to a queryset, we need to
			# forcibly invalidate the prefetch cache on the instance.
			instance._prefetched_objects_cache = {}

		return Response(serializer.data)


# /api/v1/recycle/commercial-requests/<pk>/cancel
# path args:
#   - pk <int>: primary key of CommercialRequest object
# methods:
#   - delete
# returns success status: 204 (on delete):
class CancelCommercialOrderAPIView(generics.DestroyAPIView):
	permission_classes = _PERMISSION_CLASSES
	queryset = CommercialRequest.objects.all()

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		if not request.user.is_superuser:
			if instance.status in [CommercialRequest.DONE, CommercialRequest.REJECTED]:
				return Response(status=status.HTTP_400_BAD_REQUEST, data={
					'message': 'Unable to cancel finished or rejected requests'
				})

		self.perform_destroy(instance)
		return Response(status=status.HTTP_204_NO_CONTENT)

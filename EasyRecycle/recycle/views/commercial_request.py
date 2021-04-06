from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from recycle.models import CommercialRequest
from recycle.permissions import IsCommercialUser, IsGarbageCollector
from recycle.serializers import (
	CommercialRequestSerializer, CreateCommercialRequestSerializer, EditCommercialRequestSerializer
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
#       "date": <string>,
#       "garbage_type": <string>,
#       "status": <string>,
#       "service_id": <int>,
#       "user_id": <int>
#     },
#     ...
#   ]
class CommercialRequestsAPIView(generics.ListAPIView):
	permission_classes = _PERMISSION_CLASSES
	queryset = CommercialRequest.objects.order_by('-date')
	serializer_class = CommercialRequestSerializer

	def get_queryset(self):
		queryset = super().get_queryset()
		if self.request.user.is_superuser or self.request.user.is_garbage_collector:
			q = None
			user_pk = self.request.data.get('user_pk')
			if user_pk is not None:
				q = Q(user_pk=int(user_pk))

			service_pk = self.request.data.get('service_pk')
			if service_pk is not None:
				spk_q = Q(service_pk=int(service_pk))
				if q:
					q &= spk_q
				else:
					q = spk_q

			if q:
				queryset = queryset.filter(q)

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
#     "date": <string>,
#     "garbage_type": <string>,
#     "status": <string>,
#     "service_id": <int>,
#     "user_id": <int>
#   }
class CommercialRequestDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = _PERMISSION_CLASSES
	queryset = CommercialRequest.objects.all()
	serializer_class = CommercialRequestSerializer

	def get_object(self):
		obj = super().get_object()
		is_sudo_or_gc = self.request.user.is_superuser or self.request.user.is_garbage_collector
		if is_sudo_or_gc or obj.user.pk == self.request.user.pk:
			return obj

		raise NotFound


# /api/v1/recycle/commercial-requests/create
# methods:
#   - post:
#       - date: string
#       - garbage_type: string
#       - status: string
#       - service: int
#       - user: int
# returns (success status - 201):
#   {
#     "id": <int>,
#     "date": <string>,
#     "garbage_type": <string>,
#     "status": <string>,
#     "service": <int>,
#     "user": <int>
#   }
class CreateCommercialRequestAPIView(generics.CreateAPIView):
	permission_classes = (permissions.IsAuthenticated & (IsCommercialUser | permissions.IsAdminUser),)
	queryset = CommercialRequest.objects.all()
	serializer_class = CreateCommercialRequestSerializer


# /api/v1/recycle/commercial-requests/<pk>/edit
# path args:
#   - pk <int>: primary key of CommercialRequest object
# methods:
#   - put:
#       - date: string
#       - garbage_type: string
#       - status: string
#       - service: int
#       - user: int
# returns (success status: 200 (on update)):
#   {
#     "id": <int>,
#     "date": <string>,
#     "garbage_type": <string>,
#     "status": <string>,
#     "service": <int>,
#     "user": <int>
#   }
class EditCommercialRequestAPIView(generics.UpdateAPIView):
	permission_classes = (permissions.IsAuthenticated & (IsGarbageCollector | permissions.IsAdminUser),)
	queryset = CommercialRequest.objects.all()
	serializer_class = EditCommercialRequestSerializer

	def update(self, request, *args, **kwargs):
		if request.user.is_garbage_collector:
			data = {'status': request.data['status']}
		else:
			data = request.data

		partial = kwargs.pop('partial', False)
		instance = self.get_object()
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
class CancelCommercialRequestAPIView(generics.DestroyAPIView):
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

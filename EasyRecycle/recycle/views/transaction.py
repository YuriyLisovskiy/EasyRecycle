from django.db.models import Q
from rest_framework import generics, permissions, status, pagination
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from core.models import UserModel
from recycle import garbage
from recycle.models import Transaction
from recycle.permissions import IsGarbageCollector
from recycle.serializers import TransactionSerializer, CreateTransactionSerializer


_PERMISSION_CLASSES = (permissions.IsAuthenticated & (
	permissions.IsAdminUser | IsGarbageCollector
),)


# /api/v1/recycle/transactions
# methods:
#   - get:
#       - user_pk: int (for superusers and garbage collectors only)
#       - collector_pk: int (for superusers and garbage collectors only)
# returns (success status - 200):
#   [
#     {
#       "id": <int>,
#       "datetime": <string>,
#       "garbage_type": <string>,
#       "mass": <float>,
#       "points": <int>,
#       "user_id": <int>,
#       "collector_id": <int>
#     },
#     ...
#   ]


class TransactionsAPIView(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = Transaction.objects.order_by('-datetime')
	serializer_class = TransactionSerializer

	def get_queryset(self):
		queryset = super().get_queryset()
		if self.request.user.is_superuser or self.request.user.is_garbage_collector:
			q = None
			user_pk = self.request.query_params.get('user_pk')
			if user_pk is not None:
				q = Q(user_id=int(user_pk))

			collector_pk = self.request.query_params.get('collector_pk')
			if collector_pk is not None:
				cpk_q = Q(collector_id=int(collector_pk))
				if q:
					q &= cpk_q
				else:
					q = cpk_q

			if q:
				queryset = queryset.filter(q)

			return queryset

		return queryset.filter(user=self.request.user)


# /api/v1/recycle/transactions/<pk>
# path args:
#   - pk <int>: primary key of Transaction object
# methods:
#   - get
# returns (success status - 200):
#   {
#     "id": <int>,
#     "datetime": <string>,
#     "garbage_type": <string>,
#     "mass": <float>,
#     "points": <int>,
#     "user_id": <int>,
#     "collector_id": <int>
#   }
class TransactionDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = Transaction.objects.all()
	serializer_class = TransactionSerializer

	def get_object(self):
		obj = super().get_object()
		is_sudo_or_gc = self.request.user.is_superuser or self.request.user.is_garbage_collector
		if is_sudo_or_gc or obj.user.pk == self.request.user.pk:
			return obj

		raise NotFound


# /api/v1/recycle/transactions/create
# methods:
#   - post:
#       - garbage_type: string
#       - float: mass
#       - user: int
# returns (success status - 201):
#   {
#     "id": <int>,
#     "datetime": <string>,
#     "garbage_type": <string>,
#     "mass": <mass>,
#     "points": <int>,
#     "user": <int>
#     "collector": <int>
#   }
class CreateTransactionAPIView(generics.CreateAPIView):
	permission_classes = (permissions.IsAuthenticated & IsGarbageCollector,)
	queryset = Transaction.objects.all()
	serializer_class = CreateTransactionSerializer

	def create(self, request, *args, **kwargs):
		data = request.data.copy()

		if 'garbage_type' not in data:
			return Response({'detail': 'garbage_type is required'}, status=status.HTTP_400_BAD_REQUEST)

		if 'mass' not in data:
			return Response({'detail': 'mass is required'}, status=status.HTTP_400_BAD_REQUEST)

		if 'user' not in data:
			return Response({'detail': 'user is required'}, status=status.HTTP_400_BAD_REQUEST)

		# TODO: calculate points according to garbage type.
		data['points'] = round(garbage.GARBAGE_TO_POINTS[data['garbage_type']] * float(data['mass']))
		data['collector'] = request.user.pk
		serializer = self.get_serializer(data=data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)

		user = UserModel.objects.filter(pk=data['user']).first()
		if user:
			user.rating += data['points']
			user.save()

		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# /api/v1/recycle/transactions/<pk>/delete
# path args:
#   - pk <int>: primary key of Transaction object
# methods:
#   - delete
# returns success status: 204 (on delete)
class DeleteTransactionAPIView(generics.DestroyAPIView):
	permission_classes = (permissions.IsAdminUser,)
	queryset = Transaction.objects.all()

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.perform_destroy(instance)

		user = UserModel.objects.filter(pk=instance.user.pk).first()
		if user:
			user.rating -= instance.points
			user.save()

		return Response(status=status.HTTP_204_NO_CONTENT)

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Transaction
from recycle.views.transaction import DeleteTransactionAPIView
from tests.unittests.common import APIFactoryTestCase


class DeleteTransactionAPIViewDeleteTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(DeleteTransactionAPIViewDeleteTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.transaction = Transaction.objects.get(user=self.user)
		self.view = DeleteTransactionAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:delete_transaction', args=[self.transaction.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.transaction.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_DeleteLocation_AnonymousUser(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:delete_transaction', args=[self.transaction.pk]))
		response = self.view(request, pk=self.transaction.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_DeleteLocation_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_DeleteLocation_CommercialUser(self):
		self.check_permission_denied()

	def test_DeleteLocation_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_DeleteLocation_SuperUser(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:delete_transaction', args=[self.transaction.pk]))
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.transaction.pk)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertIsNone(Transaction.objects.filter(pk=self.transaction.pk).first())

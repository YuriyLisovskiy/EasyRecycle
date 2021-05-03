from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Transaction
from recycle.views.transaction import TransactionDetailsAPIView
from tests.unittests.common import APIFactoryTestCase


class TransactionDetailsAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(TransactionDetailsAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.user2 = UserModel.objects.get(username='User2')
		self.view = TransactionDetailsAPIView.as_view()
		self.expected_transaction = Transaction.objects.filter(user=UserModel.objects.get(username='User')).first()

	def test_GetInfo_NotAuthenticated(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transaction', args=[self.expected_transaction.id]))
		response = self.view(request, pk=self.expected_transaction.id)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_GetInfo_IsNotOwner(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transaction', args=[self.expected_transaction.id]))
		force_authenticate(request, self.user2)
		response = self.view(request, pk=self.expected_transaction.id)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_GetInfoOfSelf(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transaction', args=[self.expected_transaction.id]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.expected_transaction.id)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_location = response.data
		self.assertEqual(actual_location['id'], self.expected_transaction.id)
		self.assertEqual(self.expected_transaction.datetime.strftime('%b %d, %Y at %H:%M'), actual_location['datetime'])
		self.assertEqual(self.expected_transaction.garbage_type, actual_location['garbage_type'])
		self.assertEqual(self.expected_transaction.mass, actual_location['mass'])
		self.assertEqual(self.expected_transaction.points, actual_location['points'])
		self.assertEqual(self.expected_transaction.user.id, actual_location['user_id'])
		self.assertEqual(self.expected_transaction.collector.id, actual_location['collector_id'])

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Transaction
from recycle.views.transaction import TransactionsAPIView
from tests.unittests.common import APIFactoryTestCase


class TransactionsAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(TransactionsAPITestCase, self).setUp()
		self.view = TransactionsAPIView.as_view()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.expected_transactions = Transaction.objects.order_by('-datetime')

	def test_GetListAnonymousUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transactions'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_GetInfoAuthenticatedUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transactions'))
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data
		expected_count = self.expected_transactions.count()
		self.assertEqual(actual_transactions['count'], expected_count)
		i = 0
		for expected in self.expected_transactions:
			location = actual_transactions['results'][i]
			self.assertEqual(location['id'], expected.id)
			i += 1

	def test_GetInfoByUserPk_SuperUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transactions'), data={
			'user_pk': self.user.pk
		})
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data
		expected_count = self.expected_transactions.count()
		self.assertEqual(actual_transactions['count'], expected_count)

	def test_GetInfoByGarbageCollector_SuperUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_transactions'), data={
			'collector_pk': self.gc_user.pk
		})
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data
		self.assertEqual(actual_transactions['count'], 1)

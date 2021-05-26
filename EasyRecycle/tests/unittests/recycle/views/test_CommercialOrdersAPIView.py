from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import CommercialRequest, Location
from recycle.views.commercial_order import CommercialOrdersAPIView
from tests.unittests.common import APIFactoryTestCase


class CommercialOrdersAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(CommercialOrdersAPITestCase, self).setUp()
		self.view = CommercialOrdersAPIView.as_view()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.commercial_user = UserModel.objects.get(username='CommercialUser')
		self.expected_commercial_orders = CommercialRequest.objects.order_by('date').all()

	def test_GetListAnonymousUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_PermissionDenied(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'))
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def check_commercial_orders(self, response):
		actual_transactions = response.data
		expected_count = self.expected_commercial_orders.count()
		self.assertEqual(actual_transactions['count'], expected_count)
		i = 0
		for expected in self.expected_commercial_orders:
			location = actual_transactions['results'][i]
			self.assertEqual(location['id'], expected.id)
			i += 1

	def test_GetAllCommercialUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'))
		force_authenticate(request, self.commercial_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.check_commercial_orders(response)

	def test_GetAll(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'))
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.check_commercial_orders(response)

	def test_OrderByStatus(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'), data={
			'order_by_status': 'true'
		})
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data

		orders = CommercialRequest.objects.order_by('status', 'date').all()
		expected_count = orders.count()
		self.assertEqual(actual_transactions['count'], expected_count)
		i = 0
		for expected in orders:
			location = actual_transactions['results'][i]
			self.assertEqual(location['id'], expected.id)
			i += 1

	def test_FilterByUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'), data={
			'user_pk': self.commercial_user.id
		})
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data

		orders = self.expected_commercial_orders.filter(user_id=self.commercial_user.id)
		expected_count = orders.count()
		self.assertEqual(actual_transactions['count'], expected_count)
		i = 0
		for expected in orders:
			location = actual_transactions['results'][i]
			self.assertEqual(location['id'], expected.id)
			i += 1

	def test_FilterByUser_InvalidId(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'), data={
			'user_pk': 'one'
		})
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_FilterByLocation(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'), data={
			'location': 'true'
		})
		force_authenticate(request, self.gc_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data

		orders = self.expected_commercial_orders.filter(location=Location.objects.get(address='Some st. 7'))
		expected_count = orders.count()
		self.assertEqual(actual_transactions['count'], expected_count)
		i = 0
		for expected in orders:
			location = actual_transactions['results'][i]
			self.assertEqual(location['id'], expected.id)
			i += 1

	def test_FilterByStatus(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_orders'), data={
			'status': CommercialRequest.QUEUED
		})
		force_authenticate(request, self.gc_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_transactions = response.data

		orders = self.expected_commercial_orders.filter(status=CommercialRequest.QUEUED)
		expected_count = orders.count()
		self.assertEqual(actual_transactions['count'], expected_count)
		i = 0
		for expected in orders:
			location = actual_transactions['results'][i]
			self.assertEqual(location['id'], expected.id)
			i += 1

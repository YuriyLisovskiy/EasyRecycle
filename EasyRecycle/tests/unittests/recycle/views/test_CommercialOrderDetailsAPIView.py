from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import CommercialRequest
from recycle.views.commercial_order import CommercialOrderDetailsAPIView
from tests.unittests.common import APIFactoryTestCase


class CommercialOrderDetailsAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(CommercialOrderDetailsAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='CommercialUser')
		self.commercial_user_2 = UserModel.objects.get(username='CommercialUser2')
		self.view = CommercialOrderDetailsAPIView.as_view()
		self.expected_commercial_order = CommercialRequest.objects.filter(user=self.user).first()

	def test_GetInfo(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_commercial_order', args=[self.expected_commercial_order.id]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.expected_commercial_order.id)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_commercial_order = response.data
		self.assertEqual(actual_commercial_order['id'], self.expected_commercial_order.id)
		self.assertEqual(self.expected_commercial_order.address, actual_commercial_order['address'])
		self.assertEqual(self.expected_commercial_order.date.strftime('%Y-%m-%d'), actual_commercial_order['date'])
		self.assertEqual(self.expected_commercial_order.garbage_type, actual_commercial_order['garbage_type'])
		self.assertEqual(self.expected_commercial_order.mass, actual_commercial_order['mass'])
		self.assertEqual(self.expected_commercial_order.status, actual_commercial_order['status'])
		self.assertEqual(self.expected_commercial_order.location.id, actual_commercial_order['location_id'])
		self.assertEqual(self.expected_commercial_order.user.id, actual_commercial_order['user_id'])

	def test_NotFoundExistent(self):
		request = self.request_factory.get(
			reverse('api_v1:recycle:get_commercial_order', args=[self.expected_commercial_order.id]))
		force_authenticate(request, self.commercial_user_2)
		response = self.view(request, pk=self.expected_commercial_order.id)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

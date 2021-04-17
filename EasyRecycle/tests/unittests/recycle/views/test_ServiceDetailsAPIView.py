from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Service
from recycle.views.service import ServiceDetailsAPIView
from tests.unittests.common import APIFactoryTestCase


class LocationDetailsAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(LocationDetailsAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.view = ServiceDetailsAPIView.as_view()
		self.expected_service = Service.objects.filter(service_name='Some service').first()

	def run_GetInfo_test(self, request):
		response = self.view(request, pk=self.expected_service.id)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_location = response.data
		self.assertEqual(actual_location['id'], self.expected_service.id)
		self.assertEqual(self.expected_service.garbage_type, actual_location['garbage_type'])
		self.assertEqual(self.expected_service.service_name, actual_location['service_name'])
		self.assertEqual(self.expected_service.price_per_kg, actual_location['price_per_kg'])
		self.assertEqual(self.expected_service.location.id, actual_location['location_id'])

	def test_GetInfo(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_service', args=[self.expected_service.id]))
		self.run_GetInfo_test(request)

	def test_GetInfoOfSelf(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_service', args=[self.expected_service.id]))
		force_authenticate(request, self.user)
		self.run_GetInfo_test(request)

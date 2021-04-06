from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Service
from recycle.views.service import ServicesAPIView
from tests.unittests.common import APIFactoryTestCase


class ServicesAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(ServicesAPITestCase, self).setUp()
		self.view = ServicesAPIView.as_view()
		self.user = UserModel.objects.filter(username='User')
		self.expected_services = Service.objects.order_by('location')

	def run_GetList_test(self, request):
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_locations = response.data
		expected_count = self.expected_services.count()
		self.assertEqual(actual_locations['count'], expected_count)
		i = 0
		for expected in self.expected_services:
			location = actual_locations['results'][i]
			self.assertEqual(location['id'], expected.id)
			self.assertTrue('garbage_type' in location)
			self.assertTrue('service_name' in location)
			self.assertTrue('price_per_kg' in location)
			self.assertTrue('location_id' in location)
			i += 1

	def test_GetListAnonymousUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_services'))
		self.run_GetList_test(request)

	def test_GetInfoAuthenticatedUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_services'))
		force_authenticate(request, self.user)
		self.run_GetList_test(request)

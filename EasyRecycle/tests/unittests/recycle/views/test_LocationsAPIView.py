from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Location
from recycle.views.location import LocationsAPIView
from tests.unittests.common import APIFactoryTestCase


class LocationsAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(LocationsAPITestCase, self).setUp()
		self.view = LocationsAPIView.as_view()
		self.user = UserModel.objects.filter(username='User')
		self.expected_locations = Location.objects.order_by('address')

	def run_GetList_test(self, request):
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_locations = response.data
		expected_count = self.expected_locations.count()
		self.assertEqual(actual_locations['count'], expected_count)
		i = 0
		for expected in self.expected_locations:
			location = actual_locations['results'][i]
			self.assertEqual(location['id'], expected.id)
			self.assertTrue('address' in location)
			self.assertTrue('open_time' in location)
			self.assertTrue('close_time' in location)
			self.assertTrue('owner_id' in location)
			i += 1

	def test_GetListAnonymousUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_locations'))
		self.run_GetList_test(request)

	def test_GetInfoAuthenticatedUser(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_locations'))
		force_authenticate(request, self.user)
		self.run_GetList_test(request)

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Location
from recycle.views.location import LocationDetailsAPIView
from tests.unittests.common import APIFactoryTestCase


class LocationDetailsAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(LocationDetailsAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.view = LocationDetailsAPIView.as_view()
		self.expected_location = Location.objects.filter(owner=UserModel.objects.get(username='User')).first()

	def run_GetInfo_test(self, request):
		response = self.view(request, pk=self.expected_location.id)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_location = response.data
		self.assertEqual(actual_location['id'], self.expected_location.id)
		self.assertEqual(self.expected_location.address, actual_location['address'])
		self.assertEqual(self.expected_location.open_time.strftime('%H:%M:%S'), actual_location['open_time'])
		self.assertEqual(self.expected_location.close_time.strftime('%H:%M:%S'), actual_location['close_time'])
		self.assertEqual(self.expected_location.owner.id, actual_location['owner_id'])

	def test_GetInfo(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_location', args=[self.expected_location.id]))
		self.run_GetInfo_test(request)

	def test_GetInfoOfSelf(self):
		request = self.request_factory.get(reverse('api_v1:recycle:get_location', args=[self.expected_location.id]))
		force_authenticate(request, self.user)
		self.run_GetInfo_test(request)

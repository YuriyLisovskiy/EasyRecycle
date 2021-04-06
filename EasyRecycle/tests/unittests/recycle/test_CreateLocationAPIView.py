from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.views.location import CreateLocationAPIView
from tests.unittests.common import APIFactoryTestCase


class CreateLocationAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(CreateLocationAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.view = CreateLocationAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.post(reverse('api_v1:recycle:create_location'), data={
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': self.gc_user.pk
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_CreateLocation_AnonymousUser(self):
		request = self.request_factory.post(reverse('api_v1:recycle:create_location'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_CreateLocation_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_CreateLocation_CommercialUser(self):
		self.check_permission_denied()

	def test_CreateLocation_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_UserIsNotGarbageCollector(self):
		input_data = {
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': self.user.pk
		}
		request = self.request_factory.post(reverse('api_v1:recycle:create_location'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_CreateLocation_SuperUser(self):
		input_data = {
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': self.gc_user.pk
		}
		request = self.request_factory.post(reverse('api_v1:recycle:create_location'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		actual_location = response.data
		self.assertEqual(input_data['address'], actual_location['address'])
		self.assertEqual(input_data['open_time'], actual_location['open_time'][:-3])
		self.assertEqual(input_data['close_time'], actual_location['close_time'][:-3])
		self.assertEqual(input_data['owner'], actual_location['owner'])

	def run_missing_field(self, field):
		input_data = {
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': self.gc_user.pk
		}
		input_data.pop(field)
		request = self.request_factory.post(reverse('api_v1:recycle:create_location'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_MissingAddress(self):
		self.run_missing_field('address')

	def test_MissingOpenTime(self):
		self.run_missing_field('open_time')

	def test_MissingCloseTime(self):
		self.run_missing_field('close_time')

	def test_MissingOwner(self):
		self.run_missing_field('owner')

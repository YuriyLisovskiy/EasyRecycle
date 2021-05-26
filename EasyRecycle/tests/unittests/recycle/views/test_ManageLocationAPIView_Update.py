from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle import garbage
from recycle.models import Location
from recycle.views.location import ManageLocationAPIView
from tests.unittests.common import APIFactoryTestCase


class ManageLocationAPIViewUpdateTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(ManageLocationAPIViewUpdateTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.location = Location.objects.get(address='Some st. 7')
		self.view = ManageLocationAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.put(reverse('api_v1:recycle:manage_location', args=[self.location.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_UpdateLocation_AnonymousUser(self):
		request = self.request_factory.put(reverse('api_v1:recycle:manage_location', args=[self.location.pk]))
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_UpdateLocation_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_UpdateLocation_CommercialUser(self):
		self.check_permission_denied()

	def test_UpdateLocation_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_UserIsNotGarbageCollector(self):
		input_data = {
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': self.user.pk
		}
		request = self.request_factory.put(reverse('api_v1:recycle:manage_location', args=[self.location.pk]), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_UpdateLocation_SuperUser(self):
		input_data = {
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': UserModel.objects.get(username='GCUser2').id,
			'garbage_types': [garbage.METAL, garbage.GLASS]
		}
		request = self.request_factory.put(reverse('api_v1:recycle:manage_location', args=[self.location.pk]), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_location = response.data
		self.assertEqual(input_data['address'], actual_location['address'])
		self.assertEqual(input_data['open_time'], actual_location['open_time'][:-3])
		self.assertEqual(input_data['close_time'], actual_location['close_time'][:-3])
		self.assertEqual(input_data['owner'], actual_location['owner'])

	def test_UpdateLocation_InvalidGarbageType(self):
		input_data = {
			'address': 'Hello St. 10',
			'open_time': '11:00',
			'close_time': '15:00',
			'owner': self.gc_user.pk,
			'garbage_types': [garbage.METAL, 'Food']
		}
		request = self.request_factory.put(reverse('api_v1:recycle:manage_location', args=[self.location.pk]), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def run_update_field(self, data):
		request = self.request_factory.put(reverse('api_v1:recycle:manage_location', args=[self.location.pk]), data=data)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_UpdateAddress(self):
		input_data = {
			'address': 'Hello St. 10'
		}
		self.run_update_field(input_data)
		actual_location = Location.objects.get(pk=self.location.pk)
		self.assertEqual(actual_location.address, input_data['address'])
		self.assertEqual(actual_location.open_time, self.location.open_time)
		self.assertEqual(actual_location.close_time, self.location.close_time)
		self.assertEqual(actual_location.owner, self.location.owner)

	def test_UpdateOpenTime(self):
		input_data = {
			'open_time': '11:00'
		}
		self.run_update_field(input_data)
		actual_location = Location.objects.get(pk=self.location.pk)
		self.assertEqual(actual_location.address, self.location.address)
		self.assertEqual(actual_location.open_time.strftime('%H:%M'), input_data['open_time'])
		self.assertEqual(actual_location.close_time, self.location.close_time)
		self.assertEqual(actual_location.owner, self.location.owner)

	def test_UpdateCloseTime(self):
		input_data = {
			'close_time': '15:00'
		}
		self.run_update_field(input_data)
		actual_location = Location.objects.get(pk=self.location.pk)
		self.assertEqual(actual_location.address, self.location.address)
		self.assertEqual(actual_location.open_time, self.location.open_time)
		self.assertEqual(actual_location.close_time.strftime('%H:%M'), input_data['close_time'])
		self.assertEqual(actual_location.owner, self.location.owner)

	def test_UpdateOwner(self):
		input_data = {
			'owner': self.gc_user.pk
		}
		self.run_update_field(input_data)
		actual_location = Location.objects.get(pk=self.location.pk)
		self.assertEqual(actual_location.address, self.location.address)
		self.assertEqual(actual_location.open_time, self.location.open_time)
		self.assertEqual(actual_location.close_time, self.location.close_time)
		self.assertEqual(actual_location.owner.pk, input_data['owner'])

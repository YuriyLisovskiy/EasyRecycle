from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle import garbage
from recycle.models import Location, Service
from recycle.views.service import ManageServiceAPIView
from tests.unittests.common import APIFactoryTestCase


class ManageServiceAPIViewUpdateTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(ManageServiceAPIViewUpdateTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.location = Location.objects.get(address='Second st. 1')
		self.service = Service.objects.get(service_name='Some service')
		self.view = ManageServiceAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.put(reverse('api_v1:recycle:manage_service', args=[self.service.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_UpdateService_AnonymousUser(self):
		request = self.request_factory.put(reverse('api_v1:recycle:manage_service', args=[self.service.pk]))
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_UpdateService_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_UpdateService_CommercialUser(self):
		self.check_permission_denied()

	def test_UpdateService_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_UpdateService_SuperUser(self):
		input_data = {
			'garbage_type': garbage.METAL,
			'service_name': 'My super-service',
			'price_per_kg': 1.3,
			'location': self.location.pk
		}
		request = self.request_factory.put(reverse('api_v1:recycle:manage_service', args=[self.service.pk]), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_service = response.data
		self.assertEqual(input_data['garbage_type'], actual_service['garbage_type'])
		self.assertEqual(input_data['service_name'], actual_service['service_name'])
		self.assertEqual(input_data['price_per_kg'], actual_service['price_per_kg'])
		self.assertEqual(input_data['location'], actual_service['location'])

	def run_update_field(self, data):
		request = self.request_factory.put(reverse('api_v1:recycle:manage_service', args=[self.service.pk]), data=data)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_UpdateGarbageType(self):
		input_data = {
			'garbage_type': garbage.METAL
		}
		self.run_update_field(input_data)
		actual_service = Service.objects.get(pk=self.service.pk)
		self.assertEqual(actual_service.garbage_type, input_data['garbage_type'])
		self.assertEqual(actual_service.service_name, self.service.service_name)
		self.assertEqual(actual_service.price_per_kg, self.service.price_per_kg)
		self.assertEqual(actual_service.location, self.service.location)

	def test_UpdateServiceName(self):
		input_data = {
			'service_name': 'My super-service'
		}
		self.run_update_field(input_data)
		actual_service = Service.objects.get(pk=self.service.pk)
		self.assertEqual(actual_service.garbage_type, self.service.garbage_type)
		self.assertEqual(actual_service.service_name, input_data['service_name'])
		self.assertEqual(actual_service.price_per_kg, self.service.price_per_kg)
		self.assertEqual(actual_service.location, self.service.location)

	def test_UpdatePricePerKg(self):
		input_data = {
			'price_per_kg': 1.3
		}
		self.run_update_field(input_data)
		actual_service = Service.objects.get(pk=self.service.pk)
		self.assertEqual(actual_service.garbage_type, self.service.garbage_type)
		self.assertEqual(actual_service.service_name, self.service.service_name)
		self.assertEqual(actual_service.price_per_kg, input_data['price_per_kg'])
		self.assertEqual(actual_service.location, self.service.location)

	def test_UpdateLocation(self):
		input_data = {
			'location': self.location.pk
		}
		self.run_update_field(input_data)
		actual_service = Service.objects.get(pk=self.service.pk)
		self.assertEqual(actual_service.garbage_type, self.service.garbage_type)
		self.assertEqual(actual_service.service_name, self.service.service_name)
		self.assertEqual(actual_service.price_per_kg, self.service.price_per_kg)
		self.assertEqual(actual_service.location.pk, input_data['location'])

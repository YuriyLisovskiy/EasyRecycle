from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle import garbage
from recycle.models import Location
from recycle.views.service import CreateServiceAPIView
from tests.unittests.common import APIFactoryTestCase


class CreateServiceAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(CreateServiceAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.location = Location.objects.get(address='Second st. 1')
		self.view = CreateServiceAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.post(reverse('api_v1:recycle:create_service'), data={
			'garbage_type': garbage.GLASS,
			'service_name': 'My super-service',
			'price_per_kg': 1.3,
			'location': self.location.pk
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_CreateService_AnonymousUser(self):
		request = self.request_factory.post(reverse('api_v1:recycle:create_service'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_CreateService_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_CreateService_CommercialUser(self):
		self.check_permission_denied()

	def test_CreateService_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_CreateService_SuperUser(self):
		input_data = {
			'garbage_type': garbage.GLASS,
			'service_name': 'My super-service',
			'price_per_kg': 1.3,
			'location': self.location.pk
		}
		request = self.request_factory.post(reverse('api_v1:recycle:create_service'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		actual_service = response.data
		self.assertEqual(input_data['garbage_type'], actual_service['garbage_type'])
		self.assertEqual(input_data['service_name'], actual_service['service_name'])
		self.assertEqual(input_data['price_per_kg'], actual_service['price_per_kg'])
		self.assertEqual(input_data['location'], actual_service['location'])

	def run_missing_field(self, field):
		input_data = {
			'garbage_type': garbage.GLASS,
			'service_name': 'My super-service',
			'price_per_kg': 1.3,
			'location': self.location.pk
		}
		input_data.pop(field)
		request = self.request_factory.post(reverse('api_v1:recycle:create_service'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_MissingGarbageType(self):
		input_data = {
			'service_name': 'My super-service',
			'price_per_kg': 1.3,
			'location': self.location.pk
		}
		request = self.request_factory.post(reverse('api_v1:recycle:create_service'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		actual_service = response.data
		self.assertEqual(garbage.ORGANIC, actual_service['garbage_type'])
		self.assertEqual(input_data['service_name'], actual_service['service_name'])
		self.assertEqual(input_data['price_per_kg'], actual_service['price_per_kg'])
		self.assertEqual(input_data['location'], actual_service['location'])

	def test_MissingServiceName(self):
		self.run_missing_field('service_name')

	def test_MissingPricePerKg(self):
		input_data = {
			'garbage_type': garbage.GLASS,
			'service_name': 'My super-service',
			'location': self.location.pk
		}
		request = self.request_factory.post(reverse('api_v1:recycle:create_service'), data=input_data)
		force_authenticate(request, self.super_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		actual_service = response.data
		self.assertEqual(input_data['garbage_type'], actual_service['garbage_type'])
		self.assertEqual(input_data['service_name'], actual_service['service_name'])
		self.assertEqual(0, actual_service['price_per_kg'])
		self.assertEqual(input_data['location'], actual_service['location'])

	def test_MissingLocation(self):
		self.run_missing_field('location')

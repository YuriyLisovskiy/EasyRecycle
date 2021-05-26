from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle import garbage
from recycle.views.transaction import CreateTransactionAPIView
from tests.unittests.common import APIFactoryTestCase


class CreateTransactionAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(CreateTransactionAPITestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.view = CreateTransactionAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.post(reverse('api_v1:recycle:create_transaction'), data={
			'garbage_type': garbage.METAL,
			'mass': 11.0,
			'user': self.user.pk
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_CreateLocation_AnonymousUser(self):
		request = self.request_factory.post(reverse('api_v1:recycle:create_transaction'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_CreateLocation_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_CreateLocation_CommercialUser(self):
		self.check_permission_denied()

	def test_CreateLocation_NotGarbageCollectorUser(self):
		self.check_permission_denied()

	def test_CreateLocation_GarbageCollectorUser(self):
		input_data = {
			'garbage_type': garbage.METAL,
			'mass': 11.0,
			'user': self.user.pk
		}
		request = self.request_factory.post(reverse('api_v1:recycle:create_transaction'), data=input_data)
		force_authenticate(request, self.gc_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		actual_transaction = response.data
		self.assertEqual(input_data['garbage_type'], actual_transaction['garbage_type'])
		self.assertEqual(input_data['mass'], actual_transaction['mass'])
		self.assertEqual(input_data['user'], actual_transaction['user'])

	def run_missing_field(self, field):
		input_data = {
			'garbage_type': garbage.METAL,
			'mass': 11.0,
			'user': self.user.pk
		}
		input_data.pop(field)
		request = self.request_factory.post(reverse('api_v1:recycle:create_transaction'), data=input_data)
		force_authenticate(request, self.gc_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_MissingGarbageType(self):
		self.run_missing_field('garbage_type')

	def test_MissingMass(self):
		self.run_missing_field('mass')

	def test_MissingUser(self):
		self.run_missing_field('user')

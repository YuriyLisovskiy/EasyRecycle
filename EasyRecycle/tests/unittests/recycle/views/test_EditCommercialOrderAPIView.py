from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle import garbage
from recycle.models import CommercialRequest, Location
from recycle.views.commercial_order import EditCommercialOrderAPIView
from tests.unittests.common import APIFactoryTestCase


class EditCommercialOrderAPIViewUpdateTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(EditCommercialOrderAPIViewUpdateTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.commercial_user = UserModel.objects.get(username='CommercialUser')
		self.commercial_order = CommercialRequest.objects.get(address='Hello st., 11')
		self.view = EditCommercialOrderAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.put(reverse('api_v1:recycle:edit_commercial_order', args=[self.commercial_order.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_AnonymousUser(self):
		request = self.request_factory.put(reverse('api_v1:recycle:edit_commercial_order', args=[self.commercial_order.pk]))
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_CommercialUser(self):
		self.check_permission_denied()

	def test_SuperUser(self):
		input_data = {
			'address': 'Hello St. 10',
			'date': '2021-05-03',
			'garbage_type': garbage.METAL,
			'mass': 15.7,
			'status': CommercialRequest.IN_PROGRESS,
			'location': Location.objects.get(address='Second st. 1').id,
			'user': UserModel.objects.get(username='CommercialUser2').id
		}
		request = self.request_factory.put(
			reverse('api_v1:recycle:edit_commercial_order', args=[self.commercial_order.pk]), data=input_data
		)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		actual_order = response.data
		self.assertEqual(input_data['address'], actual_order['address'])
		self.assertEqual(input_data['date'], actual_order['date'])
		self.assertEqual(input_data['garbage_type'], actual_order['garbage_type'])
		self.assertEqual(input_data['mass'], actual_order['mass'])
		self.assertEqual(input_data['status'], actual_order['status'])
		self.assertEqual(input_data['location'], actual_order['location'])
		self.assertEqual(input_data['user'], actual_order['user'])

	def test_UpdateDoneOrder(self):
		input_data = {
			'address': 'Hello St. 10'
		}
		order = CommercialRequest.objects.get(address='Hello st., 12')
		request = self.request_factory.put(
			reverse('api_v1:recycle:edit_commercial_order', args=[order.pk]), data=input_data
		)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=order.pk)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_GCUpdateStatusOnly(self):
		input_data = {
			'status': CommercialRequest.IN_PROGRESS
		}
		order = CommercialRequest.objects.get(address='Hello st., 12')
		request = self.request_factory.put(
			reverse('api_v1:recycle:edit_commercial_order', args=[order.pk]), data=input_data
		)
		force_authenticate(request, self.gc_user)
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def run_update_field(self, data):
		request = self.request_factory.put(
			reverse('api_v1:recycle:edit_commercial_order', args=[self.commercial_order.pk]), data=data
		)
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_UpdateAddress(self):
		input_data = {
			'address': 'Hello St. 10'
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.address, input_data['address'])

	def test_UpdateDate(self):
		input_data = {
			'date': '2021-05-03'
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.date.strftime('%Y-%m-%d'), input_data['date'])

	def test_UpdateGarbageType(self):
		input_data = {
			'garbage_type': garbage.PAPER
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.garbage_type, input_data['garbage_type'])

	def test_UpdateMass(self):
		input_data = {
			'mass': 15.7
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.mass, input_data['mass'])

	def test_UpdateStatus(self):
		input_data = {
			'status': CommercialRequest.IN_PROGRESS
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.status, input_data['status'])

	def test_UpdateLocation(self):
		input_data = {
			'location': Location.objects.get(address='Second st. 1').id
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.location.id, input_data['location'])

	def test_UpdateUser(self):
		input_data = {
			'user': UserModel.objects.get(username='CommercialUser2').id
		}
		self.run_update_field(input_data)
		actual_order = CommercialRequest.objects.get(pk=self.commercial_order.pk)
		self.assertEqual(actual_order.user.id, input_data['user'])

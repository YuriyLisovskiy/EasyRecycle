from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import Service
from recycle.views.service import ManageServiceAPIView
from tests.unittests.common import APIFactoryTestCase


class ManageServiceAPIViewDeleteTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(ManageServiceAPIViewDeleteTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.service = Service.objects.get(service_name='Some service')
		self.view = ManageServiceAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:manage_service', args=[self.service.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_DeleteService_AnonymousUser(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:manage_service', args=[self.service.pk]))
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_DeleteService_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_DeleteService_CommercialUser(self):
		self.check_permission_denied()

	def test_DeleteService_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_DeleteService_SuperUser(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:manage_service', args=[self.service.pk]))
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.service.pk)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertIsNone(Service.objects.filter(pk=self.service.pk).first())

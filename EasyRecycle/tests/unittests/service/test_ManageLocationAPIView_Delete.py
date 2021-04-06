from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from service.models import Location
from service.views.location import ManageLocationAPIView
from tests.unittests.common import APIFactoryTestCase


class ManageLocationAPIViewDeleteTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(ManageLocationAPIViewDeleteTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.location = Location.objects.get(address='Some st. 7')
		self.view = ManageLocationAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.delete(reverse('api_v1:service:manage_location', args=[self.location.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_DeleteLocation_AnonymousUser(self):
		request = self.request_factory.delete(reverse('api_v1:service:manage_location', args=[self.location.pk]))
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_DeleteLocation_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_DeleteLocation_CommercialUser(self):
		self.check_permission_denied()

	def test_DeleteLocation_GarbageCollectorUser(self):
		self.check_permission_denied()

	def test_DeleteLocation_SuperUser(self):
		request = self.request_factory.delete(reverse('api_v1:service:manage_location', args=[self.location.pk]))
		force_authenticate(request, self.super_user)
		response = self.view(request, pk=self.location.pk)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertIsNone(Location.objects.filter(pk=self.location.pk).first())

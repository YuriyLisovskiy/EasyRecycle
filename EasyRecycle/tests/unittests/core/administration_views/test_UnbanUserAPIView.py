from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.administration.views import UnbanUserAPIView
from tests.unittests.common import APIFactoryTestCase


class UnbanUserAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UnbanUserAPITestCase, self).setUp()
		self.view = UnbanUserAPIView.as_view()
		self.admin_user = User.objects.get(username='admin')
		self.user = User.objects.get(username='User')
		self.banned_user = User.objects.get(username='banned')

	def test_UnbanUser(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[self.banned_user.pk]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=self.banned_user.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_UnbanUserNonAdmin(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[self.banned_user.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.banned_user.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
	
	def test_UnbanNonexistentUser(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[9999]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_UnbanUserUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[self.banned_user.pk]))
		response = self.view(request, pk=self.banned_user.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
	
	def test_UnbanUserTwice(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[self.banned_user.pk]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=self.banned_user.pk)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		response = self.view(request, pk=self.banned_user.pk)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_UnbanSelf(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[self.admin_user.pk]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=self.admin_user.pk)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		
	def test_UnbanNotBanned(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:unban_user', args=[1]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

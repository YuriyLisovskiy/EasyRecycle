from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import SelfUserAPIView
from tests.unittests.common import APIFactoryTestCase


class SelfUserAPITestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(SelfUserAPITestCase, self).setUp()
		self.view = SelfUserAPIView.as_view()
		self.user = User.objects.get(username='User')

	def test_success(self):
		request = self.request_factory.get(reverse('api_v1:core:get_self'))
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

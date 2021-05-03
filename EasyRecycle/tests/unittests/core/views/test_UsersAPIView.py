from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import UsersAPIView
from tests.unittests.common import APIFactoryTestCase


class UsersAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UsersAPITestCase, self).setUp()
		self.view = UsersAPIView.as_view()
		self.user = User.objects.get(username='User')
		self.user_3 = User.objects.get(username='User3')

	def test_not_authenticated(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_all(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'))
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 4)

	def test_garbage_collectors(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'), data={
			'garbage_collectors': 'true'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 0)

	def test_order_by_name(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'), data={
			'order_by': 'name'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 7)

	def test_order_by_rating(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'), data={
			'order_by': 'rating'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 7)

	def test_page_valid(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'), data={
			'page': 1
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 7)

	def test_page_invalid(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'), data={
			'page': 'one'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_page_minus1(self):
		request = self.request_factory.get(reverse('api_v1:core:get_users'), data={
			'page': -1
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 7)

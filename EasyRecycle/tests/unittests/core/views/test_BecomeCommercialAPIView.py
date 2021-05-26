from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import DeactivateSelfAPIView, BecomeCommercialAPIView
from tests.unittests.common import APIFactoryTestCase


class BecomeCommercialAPITestCase(APIFactoryTestCase):

    def setUp(self) -> None:
        super(BecomeCommercialAPITestCase, self).setUp()
        self.view = BecomeCommercialAPIView.as_view()
        self.user = User.objects.get(username='User')
        self.user_2 = User.objects.get(username='User2')
        self.user_3 = User.objects.get(username='User3')
        self.commercial_user = User.objects.get(username='Commercial')

    def test_BecomeCommercialValid(self):
        request = self.request_factory.put(reverse('api_v1:core:become_commercial'), {
            'password': 'qwerty'
        })
        force_authenticate(request, self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.get(username='User').is_commercial)

    def test_BecomeCommercialInvalid(self):
        request = self.request_factory.put(reverse('api_v1:core:become_commercial'), {
            'password': 'qerty'
        })
        force_authenticate(request, self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_BecomeCommercialUnauthenticated(self):
        request = self.request_factory.put(reverse('api_v1:core:become_commercial'), {
            'password': 'qwerty'
        })
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_BecomeCommercialNoData(self):
        request = self.request_factory.put(reverse('api_v1:core:become_commercial'))
        force_authenticate(request, self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_BecomeCommercialAlreadyCommercial(self):
        request = self.request_factory.put(reverse('api_v1:core:become_commercial'), {
            'password': 'qwerty'
        })
        force_authenticate(request, self.commercial_user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

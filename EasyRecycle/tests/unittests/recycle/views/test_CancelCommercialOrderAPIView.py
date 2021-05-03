from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate

from core.models import UserModel
from recycle.models import CommercialRequest
from recycle.views.commercial_order import CancelCommercialOrderAPIView
from tests.unittests.common import APIFactoryTestCase


class CancelCommercialOrderAPIViewDeleteTestCase(APIFactoryTestCase):

	def setUp(self) -> None:
		super(CancelCommercialOrderAPIViewDeleteTestCase, self).setUp()
		self.user = UserModel.objects.get(username='User')
		self.commercial_user = UserModel.objects.get(username='CommercialUser')
		self.gc_user = UserModel.objects.get(username='GCUser')
		self.super_user = UserModel.objects.get(username='SuperUser')
		self.commercial_order = CommercialRequest.objects.get(user=self.commercial_user, status=CommercialRequest.QUEUED)
		self.view = CancelCommercialOrderAPIView.as_view()

	def check_permission_denied(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:cancel_commercial_order', args=[self.commercial_order.pk]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def check_succeeded(self, request):
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertIsNone(CommercialRequest.objects.filter(pk=self.commercial_order.pk).first())

	def test_Cancel_AnonymousUser(self):
		request = self.request_factory.delete(reverse('api_v1:recycle:cancel_commercial_order', args=[self.commercial_order.pk]))
		response = self.view(request, pk=self.commercial_order.pk)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_Cancel_AuthenticatedUser(self):
		self.check_permission_denied()

	def test_Cancel_CommercialUser(self):
		request = self.request_factory.delete(
			reverse('api_v1:recycle:cancel_commercial_order', args=[self.commercial_order.pk])
		)
		force_authenticate(request, self.commercial_user)
		self.check_succeeded(request)

	def test_Cancel_GarbageCollectorUser(self):
		request = self.request_factory.delete(
			reverse('api_v1:recycle:cancel_commercial_order', args=[self.commercial_order.pk])
		)
		force_authenticate(request, self.gc_user)
		self.check_succeeded(request)

	def test_Cancel_SuperUser(self):
		request = self.request_factory.delete(
			reverse('api_v1:recycle:cancel_commercial_order', args=[self.commercial_order.pk])
		)
		force_authenticate(request, self.super_user)
		self.check_succeeded(request)

	def test_Cancel_Done(self):
		done_order = CommercialRequest.objects.get(user=self.commercial_user, status=CommercialRequest.DONE)
		request = self.request_factory.delete(
			reverse('api_v1:recycle:cancel_commercial_order', args=[done_order.pk])
		)
		force_authenticate(request, self.commercial_user)
		response = self.view(request, pk=done_order.pk)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

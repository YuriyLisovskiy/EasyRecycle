from django.test import TestCase

from recycle.permissions import IsGarbageCollector, IsCommercialUser


class IsGarbageCollectorTestCase(TestCase):

	class MockedRequest:
		class User:
			@property
			def is_garbage_collector(self):
				return True

		user = User()

	def test_has_permissions(self):
		permission = IsGarbageCollector()
		self.assertTrue(permission.has_permission(self.MockedRequest(), None))


class IsCommercialUserTestCase(TestCase):

	class MockedRequest:
		class User:
			@property
			def is_commercial(self):
				return True

		user = User()

	def test_has_permissions(self):
		permission = IsCommercialUser()
		self.assertTrue(permission.has_permission(self.MockedRequest(), None))

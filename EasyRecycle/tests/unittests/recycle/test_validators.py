from django.test import TestCase
from rest_framework.exceptions import ValidationError

from recycle.validators import IsGarbageCollectorValidator, IsCommercialValidator


class IsGarbageCollectorValidatorTestCase(TestCase):

	class MockedUser:

		@property
		def is_superuser(self):
			return True

	def test_perform_validation(self):
		IsGarbageCollectorValidator('gc').perform_validation({
			'gc': self.MockedUser()
		})


class IsCommercialValidatorTestCase(TestCase):

	class MockedUser:

		@property
		def is_commercial(self):
			return False

	def test_perform_validation(self):
		self.assertRaises(
			ValidationError,
			lambda: IsCommercialValidator('commercial').perform_validation({
				'commercial': self.MockedUser()
			})
		)

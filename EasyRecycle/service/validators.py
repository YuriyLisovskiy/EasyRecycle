from django.utils.translation import ugettext_lazy as _

from rest_framework.exceptions import ValidationError

from core.validators import ValidatorBase


class IsGarbageCollectorValidator(ValidatorBase):
	error_message = _('Garbage collector status is required')

	def __init__(self, field):
		self.user_field = field
		super().__init__([field])

	def perform_validation(self, attrs):
		if self.user_field in attrs:
			if not attrs[self.user_field].is_garbage_collector:
				raise ValidationError(self.error_message)


class IsCommercialValidator(ValidatorBase):
	error_message = _('Commercial user is required')

	def __init__(self, field):
		self.user_field = field
		super().__init__([field])

	def perform_validation(self, attrs):
		if self.user_field in attrs:
			if not attrs[self.user_field].is_commercial:
				raise ValidationError(self.error_message)

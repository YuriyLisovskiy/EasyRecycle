from django.test import TestCase

from core.validators import ValidatorBase, UsernameValidator, PasswordValidator


class ValidatorBaseTestCase(TestCase):

    validator = ValidatorBase(['one', 'two'])

    def test_perform_validation_throws(self):
        self.assertRaises(NotImplementedError, lambda: self.validator.perform_validation([]))

    def test_repr(self):
        self.assertEqual(self.validator.__repr__(), "<ValidatorBase(fields=['one', 'two'])>")


class UsernameValidatorTestCase(TestCase):

    def test_validate(self):
        validator = UsernameValidator(
            username_key='username', min_len=5, max_len=120, allowed_chars='123456'
        )
        self.assertTrue('username' in validator._validate('hello 111123222'))


class PasswordValidatorTestCase(TestCase):

    def test_min_len(self):
        validator = PasswordValidator(min_len=10)
        self.assertEqual(validator.min_len, 10)

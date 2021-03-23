from rest_framework.test import APITestCase, APIRequestFactory

from core.models import UserModel


class APIFactoryTestCase(APITestCase):
	def setUp(self) -> None:
		super(APIFactoryTestCase, self).setUp()
		self.request_factory = APIRequestFactory()

	@classmethod
	def setUpTestData(cls):
		# Set up non-modified objects used by all test methods
		user1 = UserModel.objects.create(username='User', email='mail@mail.com')
		user1.set_password('qwerty')
		user1.save()
		user2 = UserModel.objects.create(username='User2', email='mail2@mail.com')
		user2.set_password('12345678')
		user2.save()
		UserModel.objects.create(username='User3', email='mail3@mail.com', )
		UserModel.objects.create(username='User4', email='mail4@mail.com', )
		UserModel.objects.create(username='admin', email='admin@mail.com', is_superuser=True)
		UserModel.objects.create(username='banned', is_active=False)

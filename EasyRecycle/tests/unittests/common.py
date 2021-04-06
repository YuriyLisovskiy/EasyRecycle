from rest_framework.test import APITestCase, APIRequestFactory

from core.models import UserModel
from recycle.models import Location


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
		super_user = UserModel.objects.create(username='SuperUser', email='super_user@mail.com', is_staff=True)
		super_user.set_password('87654321')
		super_user.save()
		UserModel.objects.create(username='User3', email='mail3@mail.com', )
		UserModel.objects.create(username='User4', email='mail4@mail.com', )
		UserModel.objects.create(username='admin', email='admin@mail.com', is_superuser=True)
		UserModel.objects.create(username='banned', is_active=False)
		UserModel.objects.create(username='GCUser', is_active=False, is_garbage_collector=True)

		Location.objects.create(address='Some st. 7', open_time='09:00', close_time='20:00', owner=user1)
		Location.objects.create(address='Second st. 1', open_time='10:00', close_time='18:00', owner=user1)
		Location.objects.create(address='Some Another st. 18', open_time='09:00', close_time='19:00', owner=user2)

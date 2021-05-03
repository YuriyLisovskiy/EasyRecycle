import datetime

from rest_framework.test import APITestCase, APIRequestFactory

from core.models import UserModel
from recycle import garbage
from recycle.models import Location, GarbageType, Transaction, CommercialRequest


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
		commercial_user = UserModel.objects.create(
			username='Commercial', email='commercial@mail.com', is_commercial=True
		)
		commercial_user.set_password('qwerty')
		commercial_user.save()
		inactive_user = UserModel.objects.create(username='Inactive', email='inactive@mail.com', is_active=False)
		inactive_user.set_password('12345678')
		inactive_user.save()
		super_user = UserModel.objects.create(username='SuperUser', email='super_user@mail.com', is_staff=True, is_superuser=True)
		super_user.set_password('87654321')
		super_user.save()
		UserModel.objects.create(username='User3', email='mail3@mail.com', )
		UserModel.objects.create(username='User4', email='mail4@mail.com', )
		UserModel.objects.create(username='admin', email='admin@mail.com', is_superuser=True)
		UserModel.objects.create(username='banned', is_active=False)
		gc_user = UserModel.objects.create(username='GCUser', is_active=False, is_garbage_collector=True)
		UserModel.objects.create(username='GCUser2', is_active=False, is_garbage_collector=True)
		commercial_user = UserModel.objects.create(username='CommercialUser', is_active=False, is_commercial=True)
		UserModel.objects.create(username='CommercialUser2', is_active=False, is_commercial=True)

		loc1 = Location.objects.create(
			address='Some st. 7', open_time='09:00', close_time='20:00', price_per_kg=7.5, owner=gc_user
		)
		Location.objects.create(address='Second st. 1', open_time='10:00', close_time='18:00', price_per_kg=12.1, owner=user1)
		Location.objects.create(address='Some Another st. 18', open_time='09:00', close_time='19:00', price_per_kg=12.7, owner=user2)

		GarbageType.objects.create(garbage_type=garbage.GLASS, location=loc1)
		GarbageType.objects.create(garbage_type=garbage.PAPER, location=loc1)

		Transaction.objects.create(garbage_type=garbage.METAL, mass=10.3, points=2, user=user1, collector=gc_user)

		CommercialRequest.objects.create(
			address='Hello st., 11', date=datetime.date.today(), mass=1.0, location=loc1, user=commercial_user
		)
		CommercialRequest.objects.create(
			address='Hello st., 12', date=datetime.date.today(), mass=1.0, location=loc1, user=commercial_user,
			status=CommercialRequest.DONE
		)

from django.contrib.auth.models import AbstractUser
from django.db import models


class UserModel(AbstractUser):
	is_banned = models.BooleanField(default=False)
	is_garbage_collector = models.BooleanField(default=False)
	is_commercial = models.BooleanField(default=False)
	avatar_info = models.CharField(max_length=50)
	rating = models.IntegerField(default=0)
	show_full_name = models.BooleanField(default=True)

from django.contrib.auth.models import AbstractUser
from django.db import models


class UserModel(AbstractUser):
	is_banned = models.BooleanField(default=False)
	is_garbage_collector = models.BooleanField(default=False)
	avatar = models.ImageField(null=True, blank=True, upload_to='media')
	rating = models.IntegerField(default=0)
	show_full_name = models.BooleanField(default=True)
	show_rating = models.BooleanField(default=True)

from django.db import models

from core.models import UserModel
from recycle import garbage


class Location(models.Model):
	address = models.CharField(max_length=350)
	open_time = models.TimeField()
	close_time = models.TimeField()

	# For commercial users.
	price_per_kg = models.FloatField(default=0)

	# Garbage collector.
	owner = models.ForeignKey(to=UserModel, on_delete=models.CASCADE, related_name='locations')


class GarbageType(models.Model):
	garbage_type = models.CharField(
		max_length=2, choices=garbage.TYPE_CHOICES, default=garbage.ORGANIC
	)
	location = models.ForeignKey(to=Location, on_delete=models.CASCADE)


class CommercialRequest(models.Model):
	QUEUED = 'A'
	IN_PROGRESS = 'B'
	REJECTED = 'C'
	DONE = 'D'
	STATUS_CHOICES = [
		(QUEUED, 'Queued'),
		(IN_PROGRESS, 'In Progress'),
		(REJECTED, 'Rejected'),
		(DONE, 'Done')
	]

	address = models.CharField(max_length=350)
	date = models.DateField()
	garbage_type = models.CharField(
		max_length=2, choices=garbage.TYPE_CHOICES, default=garbage.ORGANIC
	)
	mass = models.FloatField()
	status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=QUEUED)
	location = models.ForeignKey(to=Location, on_delete=models.SET_NULL, null=True, blank=True)

	# Commercial user
	user = models.ForeignKey(to=UserModel, on_delete=models.SET_NULL, null=True, blank=True)


class Transaction(models.Model):
	datetime = models.DateTimeField(auto_now=True)
	garbage_type = models.CharField(
		max_length=2, choices=garbage.TYPE_CHOICES, default=garbage.ORGANIC
	)
	mass = models.FloatField(default=0.0)
	points = models.IntegerField(default=0)

	# Registered user
	user = models.ForeignKey(
		to=UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions'
	)

	# Garbage collector
	collector = models.ForeignKey(
		to=UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='collections'
	)

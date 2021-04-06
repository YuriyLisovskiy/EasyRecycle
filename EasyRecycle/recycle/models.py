from django.db import models

from core.models import UserModel
from recycle import garbage


class Location(models.Model):
	address = models.CharField(max_length=350)
	open_time = models.TimeField()
	close_time = models.TimeField()

	# Garbage collector
	owner = models.ForeignKey(to=UserModel, on_delete=models.CASCADE)


class Service(models.Model):
	garbage_type = models.CharField(
		max_length=2, choices=garbage.TYPE_CHOICES, default=garbage.ORGANIC
	)
	service_name = models.CharField(max_length=150)
	price_per_kg = models.FloatField(default=0)
	location = models.ForeignKey(to=Location, on_delete=models.CASCADE)


class CommercialRequest(models.Model):
	QUEUED = 'Q'
	IN_PROGRESS = 'A'
	DONE = 'D'
	STATUS_CHOICES = [
		(QUEUED, 'Queued'),
		(IN_PROGRESS, 'In Progress'),
		(DONE, 'Done')
	]

	date = models.DateField()
	garbage_type = models.CharField(
		max_length=2, choices=garbage.TYPE_CHOICES, default=garbage.ORGANIC
	)
	status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=QUEUED)
	service = models.ForeignKey(to=Service, on_delete=models.SET_NULL, null=True, blank=True)

	# Commercial user
	user = models.ForeignKey(to=UserModel, on_delete=models.SET_NULL, null=True, blank=True)


class Transaction(models.Model):
	garbage_type = models.CharField(
		max_length=2, choices=garbage.TYPE_CHOICES, default=garbage.ORGANIC
	)
	points = models.IntegerField(default=0)

	# Registered user
	user = models.ForeignKey(
		to=UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions'
	)

	# Garbage collector
	collector = models.ForeignKey(
		to=UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='collections'
	)

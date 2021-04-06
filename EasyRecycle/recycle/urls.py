from django.urls import re_path

from recycle.views.location import (
	LocationsAPIView, LocationDetailsAPIView, CreateLocationAPIView,
	ManageLocationAPIView
)
from recycle.views.service import (
	ServicesAPIView, ServiceDetailsAPIView, CreateServiceAPIView,
	ManageServiceAPIView
)

app_name = 'recycle'

urlpatterns = [
	re_path(r'^locations/?$', LocationsAPIView.as_view(), name='get_locations'),
	re_path(r'^locations/(?P<pk>\d+)/?$', LocationDetailsAPIView.as_view(), name='get_location'),
	re_path(r'^locations/create/?$', CreateLocationAPIView.as_view(), name='create_location'),
	re_path(r'^locations/(?P<pk>\d+)/manage/?$', ManageLocationAPIView.as_view(), name='manage_location'),

	re_path(r'^services/?$', ServicesAPIView.as_view(), name='get_services'),
	re_path(r'^services/(?P<pk>\d+)/?$', ServiceDetailsAPIView.as_view(), name='get_service'),
	re_path(r'^services/create/?$', CreateServiceAPIView.as_view(), name='create_service'),
	re_path(r'^services/(?P<pk>\d+)/manage/?$', ManageServiceAPIView.as_view(), name='manage_service')
]

from django.urls import re_path

from service.views.location import (
	LocationsAPIView, LocationDetailsAPIView, CreateLocationAPIView,
	ManageLocationAPIView
)

app_name = 'service'

urlpatterns = [
	re_path(r'^locations/?$', LocationsAPIView.as_view(), name='get_locations'),
	re_path(r'^locations/(?P<pk>\d+)/?$', LocationDetailsAPIView.as_view(), name='get_location'),
	re_path(r'^locations/create/?$', CreateLocationAPIView.as_view(), name='create_location'),
	re_path(r'^locations/(?P<pk>\d+)/manage/?$', ManageLocationAPIView.as_view(), name='manage_location')
]

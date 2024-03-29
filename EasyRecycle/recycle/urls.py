from django.urls import re_path

from recycle.views.commercial_order import (
	CommercialOrdersAPIView, CommercialOrderDetailsAPIView, CreateCommercialOrderAPIView,
	EditCommercialOrderAPIView, CancelCommercialOrderAPIView
)

from recycle.views.location import (
	LocationsAPIView, LocationDetailsAPIView, CreateLocationAPIView,
	ManageLocationAPIView
)
from recycle.views.transaction import (
	TransactionsAPIView, TransactionDetailsAPIView, CreateTransactionAPIView,
	DeleteTransactionAPIView
)

app_name = 'recycle'

urlpatterns = [
	re_path(r'^commercial-orders/?$', CommercialOrdersAPIView.as_view(), name='get_commercial_orders'),
	re_path(
		r'^commercial-orders/(?P<pk>\d+)/?$', CommercialOrderDetailsAPIView.as_view(),
		name='get_commercial_order'
	),
	re_path(
		r'^commercial-orders/create/?$', CreateCommercialOrderAPIView.as_view(),
		name='create_commercial_order'
	),
	re_path(
		r'^commercial-orders/(?P<pk>\d+)/edit/?$', EditCommercialOrderAPIView.as_view(),
		name='edit_commercial_order'
	),
	re_path(
		r'^commercial-orders/(?P<pk>\d+)/cancel/?$', CancelCommercialOrderAPIView.as_view(),
		name='cancel_commercial_order'
	),

	re_path(r'^locations/?$', LocationsAPIView.as_view(), name='get_locations'),
	re_path(r'^locations/(?P<pk>\d+)/?$', LocationDetailsAPIView.as_view(), name='get_location'),
	re_path(r'^locations/create/?$', CreateLocationAPIView.as_view(), name='create_location'),
	re_path(r'^locations/(?P<pk>\d+)/manage/?$', ManageLocationAPIView.as_view(), name='manage_location'),

	re_path(r'^transactions/?$', TransactionsAPIView.as_view(), name='get_transactions'),
	re_path(r'^transactions/(?P<pk>\d+)/?$', TransactionDetailsAPIView.as_view(), name='get_transaction'),
	re_path(r'^transactions/create/?$', CreateTransactionAPIView.as_view(), name='create_transaction'),
	re_path(r'^transactions/(?P<pk>\d+)/delete/?$', DeleteTransactionAPIView.as_view(), name='delete_transaction')
]

from django.urls import re_path, include

from core.views import (
	UserDetailsAPIView, EditSelfAPIView, SelfUserAPIView,
	EditSelfAvatarAPIView, EditSelfEmailAPIView, EditSelfPasswordAPIView,
	DeactivateSelfAPIView, BecomeCommercialAPIView, UsersAPIView
)

app_name = 'core'

urlpatterns = [
	re_path(r'^users/self/edit/avatar?$', EditSelfAvatarAPIView.as_view(), name='edit_self_avatar'),
	re_path(r'^users/self/edit/email?$', EditSelfEmailAPIView.as_view(), name='edit_self_email'),
	re_path(r'^users/self/edit/password?$', EditSelfPasswordAPIView.as_view(), name='edit_self_password'),
	re_path(r'^users/self/edit/?$', EditSelfAPIView.as_view(), name='edit_self'),
	re_path(r'^users/self/deactivate/?', DeactivateSelfAPIView.as_view(), name='deactivate_self'),
	re_path(r'^users/self/become-commercial/?', BecomeCommercialAPIView.as_view(), name='become_commercial'),
	re_path(r'^users/self/?', SelfUserAPIView.as_view(), name='get_self'),
	re_path(r'^users/(?P<pk>\d+)/?', UserDetailsAPIView.as_view(), name='get_user'),
	re_path(r'^users/?', UsersAPIView.as_view(), name='get_users'),
	re_path(r'^admin/', include('core.administration.urls', namespace='administration'))
]

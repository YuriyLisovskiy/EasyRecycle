from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import re_path

urlpatterns = [
	re_path('^{}/'.format(settings.SECRET_ADMIN_URL), admin.site.urls)
]

# Add APIs here.

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

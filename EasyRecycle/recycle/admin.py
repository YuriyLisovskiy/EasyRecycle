from django.contrib import admin

from recycle.models import Location, CommercialRequest, Transaction

admin.site.register(Location)
admin.site.register(CommercialRequest)
admin.site.register(Transaction)

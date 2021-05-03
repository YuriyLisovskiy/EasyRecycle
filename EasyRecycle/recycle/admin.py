from django.contrib import admin

from recycle.models import Location, GarbageType, CommercialRequest, Transaction

admin.site.register(Location)
admin.site.register(GarbageType)
admin.site.register(CommercialRequest)
admin.site.register(Transaction)

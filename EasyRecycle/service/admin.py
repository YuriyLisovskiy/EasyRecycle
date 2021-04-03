from django.contrib import admin

from service.models import Location, Service, CommercialRequest, Transaction

admin.site.register(Location)
admin.site.register(Service)
admin.site.register(CommercialRequest)
admin.site.register(Transaction)

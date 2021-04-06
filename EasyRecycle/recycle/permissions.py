from rest_framework.permissions import BasePermission


class IsGarbageCollector(BasePermission):
    """
    Allows access only to garbage collectors.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_garbage_collector)

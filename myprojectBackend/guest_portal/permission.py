from rest_framework.permissions import BasePermission


class IsBookingOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.guest_id == request.user.id

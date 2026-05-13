from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


class HotelObjectPermissionMixin:
    def has_object_permission(self, request, view, obj):
        if obj.hotel != request.user.hotel:
            raise PermissionDenied(
                "Access denied. You cannot access data belonging to another hotel."
            )
        return True


# * All Guests View permission
class AllGuestsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            if not request.user.has_perm("api.view_guests"):
                raise PermissionDenied("You do not have permission to view guests.")

        if request.method == "POST":
            if not request.user.has_perm("api.create_guests"):
                raise PermissionDenied("You do not have permission to create guests.")

        return True


# * single Guest View permission


class SingleGuestPermission(HotelObjectPermissionMixin, BasePermission):
    def has_permission(self, request, view):

        if not request.user.has_perm("api.change_guests"):
            raise PermissionDenied("You do not have permission to modify guests.")

        return True

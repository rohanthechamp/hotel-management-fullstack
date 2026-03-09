from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


class HotelObjectPermissionMixin:
    def has_object_permission(self, request, view, obj):
        if obj.hotel != request.user.hotel:
            raise PermissionDenied(
                "Access denied. You cannot access data belonging to another hotel."
            )
        return True


# * All Cabin View permission
class AllCabinPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            if not request.user.has_perm("api.view_cabins"):
                raise PermissionDenied("You do not have permission to view cabins.")

        if request.method == "POST":
            if not request.user.has_perm("api.create_cabins"):
                raise PermissionDenied("You do not have permission to create cabins.")

        return True


class SingleCabinPermission(HotelObjectPermissionMixin, BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if request.method in ["PUT", "PATCH"]:
            if not request.user.has_perm("api.change_cabins"):
                raise PermissionDenied("You do not have permission to modify cabins.")

        if request.method == "DELETE":
            if not request.user.has_perm("api.delete_cabins"):
                raise PermissionDenied("You do not have permission to delete cabins.")

        return True


# * All Bookings View permission
class AllBookingsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            if not request.user.has_perm("api.view_bookings"):
                raise PermissionDenied("You do not have permission to view bookings.")

        return True


# * single Booking View permission
class CheckINBookingPermission(BasePermission):
    def has_permission(self, request, view):

        if not request.user.has_perm("api.checkin_guest"):
            raise PermissionDenied("You do not have permission to check in guests.")

        return True


class CheckOUTBookingPermission(BasePermission):
    def has_permission(self, request, view):

        if not request.user.has_perm("api.checkout_guest"):
            raise PermissionDenied("You do not have permission to check out guests.")

        return True


class CancelBookingPermission(BasePermission):
    def has_permission(self, request, view):

        if not request.user.has_perm("api.cancel_booking"):
            raise PermissionDenied("You do not have permission to cancel bookings.")

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


# * All Settings View permission
class AllSettingsPermission(BasePermission):
    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        # View all settings
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            if not request.user.has_perm("api.view_settings"):
                raise PermissionDenied("You do not have permission to view settings.")

        # Create new settings (Admin only)
        if request.method == "POST":
            if not request.user.has_perm("api.create_settings"):
                raise PermissionDenied("Only administrators can create new settings.")

        return True


# * single Setting View permission
class SingleSettingPermission(HotelObjectPermissionMixin, BasePermission):
    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        # Update existing settings
        if request.method in ["PUT", "PATCH"]:
            if not request.user.has_perm("api.change_settings"):
                raise PermissionDenied("You do not have permission to modify settings.")

        # Delete settings
        if request.method == "DELETE":
            if not request.user.has_perm("api.delete_settings"):
                raise PermissionDenied("You do not have permission to delete settings.")

        return True


# 7️⃣ Final system in one table
# | Module       | HTTP Action | Business Meaning        | Django Permission | Custom Permission | Hotel Scope |
# | ------------ | ----------- | ----------------------- | ----------------- | ----------------- | ----------- |
# | **Cabins**   | GET         | View cabins list        | `view_cabins`     | —                 | ✅           |
# |              | POST        | Create cabin            | `add_cabins`      | —                 | ✅           |
# |              | PUT / PATCH | Update cabin            | `change_cabins`   | —                 | ✅           |
# |              | DELETE      | Delete cabin            | `delete_cabins`   | —                 | ✅           |
# | **Bookings** | GET         | View bookings           | `view_bookings`   | —                 | ✅           |
# |              | PUT / PATCH | Check-in guest          | —                 | `checkin_guest`   | ✅           |
# |              | PUT / PATCH | Check-out guest         | —                 | `checkout_guest`  | ✅           |
# |              | PUT / PATCH | Cancel booking          | —                 | `cancel_booking`  | ✅           |
# |              | DELETE      | Delete booking          | `delete_bookings` | —                 | ✅           |
# | **Guests**   | GET         | View guests             | `view_guests`     | —                 | ✅           |
# |              | POST        | Create guest            | `add_guests`      | —                 | ✅           |
# |              | PUT / PATCH | Update guest            | `change_guests`   | —                 | ✅           |
# |              | DELETE      | Delete guest            | `delete_guests`   | —                 | ✅           |
# | **Settings** | GET         | View settings           | `view_settings`   | —                 | ✅           |
# |              | POST        | Create settings (Admin) | `add_settings`    | —                 | ✅           |
# |              | PUT / PATCH | Update settings         | `change_settings` | —                 | ✅           |
# |              | DELETE      | Delete settings         | `delete_settings` | —                 | ✅           |
# | **Users**    | GET         | View staff              | `view_user`       | —                 | ❌ (global)  |
# |              | POST        | Create staff            | `add_user`        | —                 | ❌           |
# |              | PUT / PATCH | Update staff            | `change_user`     | —                 | ❌           |
# |              | DELETE      | Delete staff            | `delete_user`     | —                 | ❌           |

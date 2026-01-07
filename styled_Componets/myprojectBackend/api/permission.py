from rest_framework.permissions import  BasePermission


# * All Cabin View permission
class AllCabinPermission(BasePermission):
    pass


# * single Cabin View permission
class SingleCabinPermission(BasePermission):
    pass


# * All Bookings View permission
class AllBookingsPermission(BasePermission):
    pass


# * single Booking View permission
class SingleBookingPermission(BasePermission):
    pass


# * All Guests View permission
class AllGuestsPermission(BasePermission):
    pass


# * single Guest View permission
class SingleGuestPermission(BasePermission):
    pass


# * All Settings View permission
class AllSettingsPermission(BasePermission):
    pass


# * single Setting View permission
class SingleSettingPermission(BasePermission):
    pass

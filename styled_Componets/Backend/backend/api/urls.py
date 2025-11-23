from django.urls import  path,include
from rest_framework.routers import  DefaultRouter
from .views import CabinViewSet, GuestsViewSet, BookingsViewSet, SettingsViewSet

router=DefaultRouter()
router.register(r'cabins',CabinViewSet)
router.register(r"guests", GuestsViewSet)
router.register(r"bookings", BookingsViewSet)
router.register(r"settings", SettingsViewSet)
urlpatterns = [
    path("", include(router.urls)),
]

# python manage.py makemigrations
# python manage.py migrate

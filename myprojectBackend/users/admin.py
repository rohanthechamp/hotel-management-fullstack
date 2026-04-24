

# Now register the new UserModelAdmin...
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User


class UserModelAdmin(BaseUserAdmin):
    ordering = ("email",)
    list_display = ("id", "email", "name", "role", "is_staff", "is_superuser")
    list_filter = ("role", "is_staff", "is_superuser")

    fieldsets = (
        ("Login", {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("name", "tc", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "name", "tc", "role", "password1", "password2", "is_staff", "is_superuser"),
            },
        ),
    )

    search_fields = ("email", "name")
    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions")


admin.site.register(User, UserModelAdmin)

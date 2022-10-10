from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import MyUser
from django.forms import Textarea

# Register your models here.

class UserAdminConfig(UserAdmin):
    search_fields = ("email", "username")
    list_filter = ("email", "username", "is_staff")
    ordering = ("id",)
    list_display = ("username", "id", "email", "is_login", "is_staff", "created_at")
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}), 
        ("Permissions", {"fields": ("is_superuser", "is_staff", "is_active")}), 
        ("Personal", {"fields": ("profile_img",)}) 
    )
    
    # for adding screen
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "is_superuser", "is_staff", "is_active")
        }),
    )

admin.site.register(MyUser, UserAdminConfig)
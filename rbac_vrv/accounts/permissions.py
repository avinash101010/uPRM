from rest_framework.permissions import BasePermission

class RoleBasedAccessPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False

        allowed_roles = getattr(view, 'allowed_roles', [])
        return user.role.name in allowed_roles


class PermissionBasedAccessPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False

        required_permission = getattr(view, 'required_permission', None)
        if required_permission:
            return user.role.permissions.filter(name=required_permission).exists()
        return True
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    # def has_permission(self, request, view):
    #     return request.user and request.user.role == 'ADMIN'
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
        # Check if the user belongs to the Admin group
            return request.user.groups.filter(name='Admin').exists()
        return False

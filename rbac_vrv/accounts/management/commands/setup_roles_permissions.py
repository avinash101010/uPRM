from django.core.management.base import BaseCommand
from accounts.models import Role, Permission

class Command(BaseCommand):
    help = 'Setup default roles and permissions'

    def handle(self, *args, **kwargs):
        # Create permissions
        perm1, _ = Permission.objects.get_or_create(name='Can View Users', description='Allows viewing user information.')
        perm2, _ = Permission.objects.get_or_create(name='Can Edit Projects', description='Allows editing projects.')

        # Create roles and assign permissions
        admin_role, _ = Role.objects.get_or_create(name='Admin')
        admin_role.permissions.add(perm1, perm2)

        manager_role, _ = Role.objects.get_or_create(name='Manager')
        manager_role.permissions.add(perm1)

        self.stdout.write(self.style.SUCCESS('Default roles and permissions created successfully!'))

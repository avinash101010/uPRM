from rest_framework import serializers
from .models import User,Role,Permission,Project,Task
from django.contrib.auth.models import Group


# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True,required=True)

#     class Meta:
#         model = User
#         fields = ('username','email', 'password','role')
    
#     def create(self, validated_data):
#         user=User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             role=validated_data['role'],
#         )
#         return user

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.CharField(write_only=True)  # Accept role as input

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role')  # Extract role from the validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        # Assign the user to the appropriate group
        group, created = Group.objects.get_or_create(name=role)
        user.groups.add(group)

        return user


    
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        # fields = '__all__'
        fields=['id', 'name', 'description']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Permission.objects.all(), write_only=True, source='permissions'
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'permissions', 'permission_ids']

    def update(self, instance, validated_data):
        permissions = validated_data.pop('permissions', [])
        instance = super().update(instance, validated_data)
        instance.permissions.set(permissions)
        return instance
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Include fields you want from the User model


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)  # Use the UserSerializer for the owner field
    # assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(groups__name='Employee'), 
    #     required=False
    # )  # Limit to employees
    assigned_to = serializers.SlugRelatedField(
        queryset=User.objects.filter(groups__name='Employee'),  # Filter users by role 'Employee'
        slug_field='username',  # Use the username field to match
        required=False
    )
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'due_date', 'status', 'owner', 'assigned_to', 'created_at']



class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'project', 'assigned_to', 'status', 'created_at', 'due_date']

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Permission, Role
from .serializers import PermissionSerializer, RoleSerializer, UserRegistrationSerializer, ProjectSerializer, TaskSerializer
from django.http import HttpResponse
# from django.contrib.auth.models import User
from .permissions import RoleBasedAccessPermission, PermissionBasedAccessPermission, IsAdmin
from rest_framework.permissions import IsAuthenticated
from .models import Project, Task, User
from django.conf import settings

# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# User = settings.AUTH_USER_MODEL  # Use the custom user model
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        print(f"Attempting login for: {attrs['username']}")
        user = User.objects.filter(username=attrs['username']).first()
        #to list all the users
        users = User.objects.all()
        #length of the users
        print(len(users))
        print(users)

        if user:
            print(f"Found user: {user.username}, is_active: {user.is_active}")
        else:
            print("No user found.")
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# class UserRegistrationView(APIView):
#     def post(self,request):
#         serializer = UserRegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data,status=status.HTTP_201_CREATED)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import AllowAny

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]  # Ensure anyone can access this view

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#to print simple hello world on the page we add the following function
def hello_world(request):
    # return render(request,'hello.html')#this will render the hello.html template
    return HttpResponse('Hello World')#this will print hello world on the page
class AdminOnlyView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({'message': 'Hello Admin!'})
class AdminOnlyView(APIView):
    permission_classes = [RoleBasedAccessPermission]
    allowed_roles = ['Admin']  # Only Admin role can access this

    def get(self, request):
        
        return Response({"message": "Hello Admin!"})


class ResourceView(APIView):
    permission_classes = [PermissionBasedAccessPermission]
    required_permission = 'view_resource'  # Example permission

    def get(self, request):
        return Response({"message": "You have the 'view_resource' permission!"})
    



class PermissionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedAccessPermission]
    allowed_roles = ['Admin']  # Only Admins can manage permissions

    def get(self, request):
        permissions = Permission.objects.all()
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PermissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoleView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedAccessPermission]
    allowed_roles = ['Admin']  # Only Admins can manage roles

    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            role = Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            return Response({'error': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoleSerializer(role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            role = Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            return Response({'error': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)
        role.delete()
        return Response({'message': 'Role deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class ProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.groups.filter(name='Manager').exists():
            # Managers can view projects they created
            projects = Project.objects.filter(owner=request.user)
        elif request.user.groups.filter(name='Employee').exists():
            # Employees can view projects assigned to them
            projects = Project.objects.filter(assigned_to=request.user)
        else:
            projects = Project.objects.none()  # Other roles have no access
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.groups.filter(name='Manager').exists():
            return Response({"error": "Only managers can create projects."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)  # Set current user as the owner (Manager)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk):
        # Update the project status
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != project.assigned_to and not request.user.groups.filter(name="Manager").exists():
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #to delete a project
    def delete(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != project.owner and not request.user.groups.filter(name="Manager").exists():
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        project.delete()
        return Response({"detail": "Project deleted successfully."}, status=status.HTTP_204_NO_CONTENT)



class TaskView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(project__owner=request.user)  # Get tasks in user's projects
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Ensure the project is valid
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class EmployeeListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Check if the logged-in user is a Manager
#         if not request.user.groups.filter(name='Manager').exists():
#             return Response({"detail": "Only managers can access this resource."}, status=status.HTTP_403_FORBIDDEN)

#         # Fetch all users with the "Employee" role
#         employees = User.objects.filter(groups__name="Employee")
#         employee_data = [{"username": emp.username, "email": emp.email} for emp in employees]

#         return Response({"employees": employee_data}, status=status.HTTP_200_OK)



class EmployeeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Check if the logged-in user is in the "Manager" group
        if not request.user.groups.filter(name="Manager").exists():
            return Response(
                {"detail": "Only managers can access this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fetch all users in the "Employee" group
        from django.contrib.auth.models import Group  # Import Group model explicitly

        try:
            employee_group = Group.objects.get(name="Employee")
        except Group.DoesNotExist:
            return Response(
                {"detail": "Employee group not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        employees = User.objects.filter(groups__name="Employee")
        employee_data = [{"username": emp.username, "email": emp.email} for emp in employees]

        return Response({"employees": employee_data}, status=status.HTTP_200_OK)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(user)
        print(user.groups)
        role = user.groups.first().name if user.groups.exists() else "Unknown"
        print(role)
        return Response({"username": user.username, "role": role})
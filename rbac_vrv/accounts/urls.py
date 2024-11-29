from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RoleView, UserRegistrationView, hello_world, CustomTokenObtainPairView, AdminOnlyView, ResourceView, PermissionView, ProjectView, TaskView, EmployeeListView, UserInfoView

# urlpatterns = [
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
# ]
urlpatterns = [
    path('api/register/', UserRegistrationView.as_view(), name='register'),  # Register
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token
    path('hello/', hello_world, name='hello_world'),
    # path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('api/admin-only/', AdminOnlyView.as_view(), name='admin_only'),
    path('api/resource/', ResourceView.as_view(), name='resource'),

    path('api/roles/', RoleView.as_view(), name='roles'),  # List all roles and create a new role
    path('api/roles/<int:pk>/', RoleView.as_view(), name='role-detail'),  # Retrieve, update, or delete a specific role
    
    path('api/permissions/', PermissionView.as_view(), name='permissions'),  # List all permissions and create new ones

    path('api/projects/', ProjectView.as_view(), name='projects'),  # GET: List projects, POST: Create project
    path('api/projects/<int:pk>/', ProjectView.as_view(), name='project-detail'),  # Use pk (primary key) as projectId
    path('api/tasks/', TaskView.as_view(), name='tasks'),  # GET: List tasks, POST: Create task

    path('api/employees/', EmployeeListView.as_view(), name='employee_list'),
    path('api/user-info/', UserInfoView.as_view(), name='user_info'),


]
# uPRM
The project is a web-based Role-Based Access Control (RBAC) application designed to provide secure and structured access to resources based on user roles such as Admin, Manager, and Employee. It offers dashboards for role-specific functionalities, allowing users to manage projects, assign tasks, and view or update statuses. Admins have additional privileges such as user account management. here Developers are portrayed as Employees.



## Technologies Used

### Frontend:

- **Framework&Library**: ReactJS, Bootstrap

### Backend:

- **Framework**: Django (Python)
- **API**: Django REST Framework (DRF) for building RESTful APIs
- **Database**: SQLite (for development)

### Authentication & Authorization:

- **JWT**: JSON Web Token for user authentication
- **Django Groups and Permissions**: For role-based access management
- **Password Hashing**: By default Django uses the PBKDF2 algorithm with a SHA256 hash, 



## Installation
- Make sure npm installed in your env
 ```bash
 npm install react react-dom react-router-dom axios bootstrap
 ```
- Backend Requirements
```bash
 pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```


## Setup Instructions

1. **Make Migrations**:
   - Navigate to *uPRM/rbac_vrv* run the following command to create migrations:
     ```bash
     python manage.py makemigrations
     ```

2. **Apply Migrations**:
   - Apply the migrations and create the database by running:
     ```bash
     python manage.py migrate
     ```

3. **Create a Superuser**:
   - To create a superuser for the Django admin panel, run:
     ```bash
     python manage.py createsuperuser
     ```
   - Follow the prompts to set up a **username**, **email**, and **password** for the superuser.

4. **Start Server and Client**:
    - Navigate to *uPRM/rbac_vrv/* and run this command to start the Django development server:
    ```bash
        python manage.py runserver
    ```
    - Navigate to *UPRM/frontend/* and start client by running:
    ```bash
        npm start
    ```
    - If you have followed everything as instructed after this step there should be a page opened in your default browser

## Usage Instructions
- First Register Few mangers and Few Employees for better understanding
- Super user created earlier also acts as Admin role we mentioned in perspective of workspace
### Manager Dashboard

- Use your **manager credentials** to log in.
- After login, the **"Assigned Projects"** tab will be displayed by default.
- Use the **navigation tabs** to switch between:
  - "Assigned Projects" (Manager can view the list of projects assinged by user and can edit project details)
  - "Employees" (Manger can view the list of all the employees(developers/team leads))
  - "Assign Project" (Manager can assign projects)
- Navigate to the **"Assign Project"** tab, fill in the details, and submit the form to assign a new project to an employee.
- Click the **"Logout"** button in the top-right corner to securely end your session.

### Employee Dashboard


- Use your **employee credentials** to log in.
- Assigned projects will be listed in a **table format** along with their current statuses.
- Use the **dropdown menu** to update the status of a project and click **"Update"** to save changes.
- Click the **"Logout"** button in the top-right corner to securely end your session.

## Future implementations
- New role such as Team leader can be added so that manager will assign projects to team member and then team leader can share to their team members
- OAuth can be implemented
- Project Reports can be introduced to models
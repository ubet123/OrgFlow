# 🏢 OrgFlow - Employee Task Management System 

**OrgFlow** is a comprehensive MERN stack application designed to streamline task assignment, tracking, and completion within organizations. With its modern dark-themed UI and mobile-responsive design, it provides managers and employees with an intuitive platform for efficient workflow management.

👉 **[Live Demo](#)** *(Coming soon - currently in development)*

---

## 🎯 Project Purpose

This system enables organizations to:
- **Digitize task management** from assignment to completion
- **Improve accountability** with clear task ownership
- **Track progress** through visual status indicators
- **Enhance productivity** with deadline tracking
- **Maintain records** of all task activities

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Component-based architecture)
- **React Router** (Navigation)
- **Axios** (API communication)
- **React Toastify** (Notifications)
- **UUID** (Unique ID generation)
- **Tailwind CSS** (Styling)
- **Vite** (Build tool)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (Server framework)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **JWT (JSON Web Token)** (Secure authentication)

### Additional Integrations
- **Nodemailer** (Email notifications for task assignment)

### Development Tools
- **Postman** (API testing)
- **Git/GitHub** (Version control)
- **ESLint** (Code quality)

---

## 👥 User Roles & Features

### 👨‍💼 Manager Dashboard
- ✅ Create tasks with titles, descriptions, and due dates
- ✅ Assign tasks to specific employees (with **email notifications**)
- ✅ View all tasks with status indicators
- ✅ Track task completion rates
- ✅ Personal chat with employees *(Upcoming)*

### 👩‍💻 Employee Dashboard
- ✅ View assigned tasks
- ✅ Mark tasks as complete
- ✅ See pending vs. completed tasks
- ✅ Visual alerts for overdue tasks
- ✅ Receive task assignment notifications via email

### 🔐 Authentication System
- ✅ Secure login using **JWT authentication** for managers and employees
- ✅ Role-based access control

### 🛠️ Admin Features
- ✅ Employee management (create/delete/edit)
- ✅ Task oversight
- ✅ System-wide controls

---

## 🖥️ Screenshots

| Page | Preview |
|------|---------|
| **Login Page** | ![Login Page](./screenshots/Screenshot%202025-06-15%20170810.png) |
| **Task Creation** | ![Task Creation](./screenshots/Screenshot%202025-06-15%20170828.png) |
| **Task View** | ![Task View](./screenshots/Screenshot%202025-07-19%20210155.png) |
| **Employee Creation** | ![Employee Creation](./screenshots/Screenshot%202025-06-15%20170847.png) |
| **Employee Directory** | ![Employee Directory](./screenshots/Screenshot%202025-07-19%20210230.png) |
| **Employee View** | ![Employee View](./screenshots/Screenshot%202025-06-15%20170954.png) |

---

## Upcoming Features ⏰
- Personal chat (employee to manager)
- Mail notifications for admin when task is completed 
---

## 📌 Status
- **JWT authentication** ✅ Implemented
- **Mail notifications** ✅ Implemented
- **Edit Employee feature** ✅ Implemented

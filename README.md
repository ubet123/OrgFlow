# 🏢 OrgFlow - Modern Task & Collaboration Platform

<div align="center">

**OrgFlow** is a full-stack **MERN work management platform** that combines task assignment, real-time chat, file attachments, analytics, and automated email notifications in a sleek, professional interface.

[![Live Demo](https://img.shields.io/badge/Live-Demo-059669?style=for-the-badge&logo=vercel)](https://org-flow-six.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Real--time-Socket.IO-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

</div>

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture & Design](#-architecture--design)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#️-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

OrgFlow is a comprehensive workplace solution designed for modern teams to:
- ✅ **Assign & track tasks** with clear ownership and due dates
- 💬 **Collaborate in real-time** with built-in WebSocket chat
- 📎 **Attach files** to tasks using cloud storage
- 📧 **Receive email notifications** for task assignments and completions
- 📊 **Visualize progress** through interactive analytics
- 🎨 **Work comfortably** with dark/light theme support
- 📱 **Stay productive anywhere** with fully responsive mobile design

---

## ✨ Key Features

### 🎯 Task Management
- **Create & assign tasks** with titles, descriptions, due dates, and file attachments
- **ID-based employee assignment** ensures data integrity across the system
- **Task status tracking** (Pending → Completed)
- **File attachments** (images, PDFs, Office docs) stored via Cloudinary
- **Attachment viewer** with download and preview capabilities
- **Task filtering** by status and employee
- **Edit & delete** with role-based permissions

### 💬 Real-Time Chat
- **WebSocket-powered messaging** using Socket.IO
- **Online presence indicators** showing active users
- **Persistent message history** stored in MongoDB
- **Mobile-optimized chat** with route-based view switching
- **Notification sound** on new message arrival
- **Date-stamped messages** with time formatting
- **Glass-morphism UI** with gradient effects

### 📧 Email Notifications
- **Task assigned emails** sent to employees via EmailJS
- **Task completed emails** sent to managers
- **Professional HTML templates** with branded styling
- **Direct platform links** in emails for quick access
- **Silent error handling** - never disrupts user experience

### 📊 Analytics & Insights
- **Task completion charts** with visual progress tracking
- **Employee performance metrics** 
- **Task timeline visualization**
- **Pie charts** for status distribution
- **Responsive chart rendering** on all devices

### 👥 Role-Based Access Control
- **Manager role**: Full access to task creation, employee management, analytics
- **Employee role**: View assigned tasks, mark complete, access chat
- **JWT authentication** with httpOnly cookies
- **Protected routes** with middleware validation
- **Session persistence** across page reloads

### 🎨 Modern UI/UX
- **Dark & light themes** with localStorage persistence
- **Tailwind CSS** for utility-first styling
- **Smooth animations** and transitions
- **Glass-morphism effects** in chat interface
- **Responsive design** - mobile, tablet, desktop optimized
- **Professional color palette** with emerald accents
- **Loading states** and skeleton screens

---

## 🛠️ Tech Stack

### Frontend
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" /><br/>
      <sub><b>React 18</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" /><br/>
      <sub><b>Vite</b></sub>
    </td>
    <td align="center" width="120">
      <img src="./tech-svgs/tailwind-svgrepo-com.svg" width="48" height="48" alt="Tailwind" /><br/>
      <sub><b>Tailwind CSS</b></sub>
    </td>
    <td align="center" width="120">
      <img src="./tech-svgs/react-router-svgrepo-com.svg" width="48" height="48" alt="React Router" /><br/>
      <sub><b>React Router</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://axios-http.com/assets/logo.svg" width="48" height="48" alt="Axios" /><br/>
      <sub><b>Axios</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" width="48" height="48" alt="Socket.IO Client" /><br/>
      <sub><b>Socket.IO</b></sub>
    </td>
  </tr>
</table>

**State Management**: Zustand  
**Form Handling**: React Hooks  
**Notifications**: React Toastify  
**Email Service**: EmailJS  
**Icons**: React Icons  

### Backend
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js" /><br/>
      <sub><b>Node.js</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="48" height="48" alt="Express" /><br/>
      <sub><b>Express.js</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="48" height="48" alt="MongoDB" /><br/>
      <sub><b>MongoDB</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg" width="48" height="48" alt="Mongoose" /><br/>
      <sub><b>Mongoose</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://jwt.io/img/pic_logo.svg" width="48" height="48" alt="JWT" /><br/>
      <sub><b>JWT Auth</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" width="48" height="48" alt="Socket.IO" /><br/>
      <sub><b>Socket.IO</b></sub>
    </td>
  </tr>
</table>

**File Storage**: Cloudinary  
**Authentication**: JWT with httpOnly cookies  
**Security**: CORS, bcryptjs password hashing  
**Middleware**: Custom auth, error handling, body parsing  

### Database Schema
- **Users**: `_id`, `name`, `email`, `password`, `role`, `employeeId`
- **Tasks**: `taskId`, `title`, `description`, `assigned`, `assignedUserId`, `dueDate`, `status`, `attachments`, `createdAt`
- **Messages**: `senderId`, `receiverId`, `message`, `createdAt`
- **Conversations**: `participants`, `messages[]`

---

## 🏗️ Architecture & Design

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Manager    │  │   Employee   │  │     Chat     │      │
│  │  Dashboard   │  │  Dashboard   │  │   Interface  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                           ▼                                  │
│                   Axios HTTP Client                          │
│                   Socket.IO Client                           │
│                      EmailJS SDK                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS / WSS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Backend (Node + Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │     Task     │  │   Message    │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                           ▼                                  │
│                    Mongoose ODM                              │
│                    Socket.IO Server                          │
│                    Cloudinary SDK                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │                                   │
          ▼                                   ▼
    ┌──────────┐                       ┌─────────────┐
    │ MongoDB  │                       │ Cloudinary  │
    │ Database │                       │   Storage   │
    └──────────┘                       └─────────────┘
```

### Data Flow
1. **Authentication**: User credentials → JWT token → httpOnly cookie
2. **Task Creation**: Form data + files → Cloudinary upload → MongoDB save → EmailJS notification
3. **Real-time Chat**: Message sent → Socket.IO broadcast → MongoDB persist → UI update
4. **Task Completion**: Employee marks done → DB update → Email to manager → Analytics refresh

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas cluster)
- **Cloudinary Account** (for file storage)
- **EmailJS Account** (for email notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/ubet123/orgflow.git
cd orgflow
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (see Environment Variables section)
# Start the server
npm start
# Or with nodemon for development
nodemon server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file (see Environment Variables section)
# Start the development server
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:3001

# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_TASK_ASSIGNED=your_task_assigned_template_id
VITE_EMAILJS_TEMPLATE_TASK_COMPLETED=your_task_completed_template_id
```

### EmailJS Setup Guide
1. Create account at [EmailJS.com](https://www.emailjs.com/)
2. Add email service (Gmail, Outlook, etc.)
3. Create 2 email templates:
   - **Task Assigned**: Notifies employee when task is created
   - **Task Completed**: Notifies manager when task is done
4. Copy Public Key, Service ID, and Template IDs to `.env`

**Template Variables:**
- Task Assigned: `employee_name`, `task_title`, `task_description`, `due_date`, `task_id`
- Task Completed: `assigned_employee`, `completion_time`, `task_title`, `task_id`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |

### Task Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/task/create` | Create new task with files | Yes | Manager |
| GET | `/task/emp` | Get employee's tasks | Yes | Employee |
| GET | `/task/admin/:employeeId` | Get tasks by employee ID | Yes | Manager |
| PATCH | `/task/complete` | Mark task as complete | Yes | Employee |
| PATCH | `/task/edit` | Edit task details | Yes | Manager |
| DELETE | `/task/delete/:taskId` | Delete task | Yes | Manager |

### User Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/user/employees` | Get all employees (basic info) | Yes | Manager |
| GET | `/user/allemployees` | Get all employees (full details) | Yes | Manager |
| GET | `/user/:id` | Get user by ID | Yes | Any |
| POST | `/user/create` | Create new employee | Yes | Manager |
| PATCH | `/user/update/:id` | Update employee | Yes | Manager |
| DELETE | `/user/delete/:id` | Delete employee | Yes | Manager |

### Attachments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/attachment/:taskId` | Get task attachments | Yes |

### Chat (Socket.IO Events)
| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Client → Server | Establish WebSocket connection |
| `newMessage` | Client → Server | Send new message |
| `newMessage` | Server → Client | Receive new message |
| `getOnlineUsers` | Server → Client | Receive online users list |

---

## 🖥️ Screenshots


### Dashboard Views

<table>
  <tr>
    <td width="50%">
      <b>Login Page</b><br/>
      <img src="./screenshots/Screenshot%202025-06-15%20170810.png" width="100%" alt="Login" />
    </td>
    <td width="50%">
      <b>Task Creation</b><br/>
      <img src="./screenshots/Screenshot%202025-06-15%20170828.png" width="100%" alt="Task Creation" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <b>Task View</b><br/>
      <img src="./screenshots/Screenshot%202025-07-19%20210155.png" width="100%" alt="Task View" />
    </td>
    <td width="50%">
      <b>Employee Creation</b><br/>
      <img src="./screenshots/Screenshot%202025-06-15%20170847.png" width="100%" alt="Employee Creation" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <b>Employee Directory</b><br/>
      <img src="./screenshots/Screenshot%202025-07-19%20210230.png" width="100%" alt="Employee Directory" />
    </td>
    <td width="50%">
      <b>Employee View</b><br/>
      <img src="./screenshots/Screenshot%202025-06-15%20170954.png" width="100%" alt="Employee View" />
    </td>
  </tr>
</table>

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

**Environment Variables on Vercel:**
- Add all `VITE_*` variables from `.env`
- Ensure `VITE_BACKEND_URL` points to your production backend

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Deploy using your preferred platform
```

**Environment Variables on Backend Platform:**
- Add all backend `.env` variables
- Set `FRONTEND_URL` to your Vercel domain
- Ensure MongoDB connection string is production-ready

### Important Deployment Notes
- ✅ Update CORS origins in backend to match frontend URL
- ✅ Use production MongoDB cluster (not localhost)
- ✅ Set secure JWT secret (use env variable generator)
- ✅ Configure Cloudinary for production usage limits
- ✅ Verify EmailJS service is active and templates are published
- ✅ Enable WebSocket support on your backend hosting platform

---

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: httpOnly cookies prevent XSS attacks
- **CORS Configuration**: Whitelist-based origin validation
- **Input Validation**: Mongoose schema validation
- **File Upload Limits**: 10MB per file, 5 files per task
- **Allowed File Types**: Images, PDFs, Office documents only
- **Role-Based Access**: Middleware checks user permissions
- **Environment Secrets**: All sensitive data in `.env` files

---

## 📂 Project Structure

```
OrgFlow/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authController.js      # Login/logout logic
│   │   ├── taskController.js      # Task CRUD operations
│   │   ├── userController.js      # Employee management
│   │   ├── message.js             # Chat message handling
│   │   └── attachmentController.js # File retrieval
│   ├── models/
│   │   ├── user.js                # User schema
│   │   ├── task.js                # Task schema
│   │   ├── message.js             # Message schema
│   │   └── conversation.js        # Conversation schema
│   ├── routes/
│   │   ├── login.js               # Auth routes
│   │   ├── task.js                # Task routes
│   │   ├── user.js                # User routes
│   │   ├── message.js             # Message routes
│   │   └── attachment.js          # Attachment routes
│   ├── middleware/
│   │   ├── cors.js                # CORS configuration
│   │   ├── errorHandler.js        # Global error handling
│   │   └── bodyParser.js          # Request parsing
│   ├── utils/
│   │   ├── auth.js                # JWT middleware
│   │   ├── fileUtils.js           # File validation
│   │   └── backfillAssignedUserId.js # Data migration script
│   ├── server.js                  # Express + Socket.IO server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/                # Images, icons
│   │   ├── chat/                  # Chat components
│   │   │   ├── ChatPage.jsx
│   │   │   ├── left/              # User list sidebar
│   │   │   └── right/             # Message view
│   │   ├── components/            # Reusable UI components
│   │   │   ├── TaskCreate.jsx     # Task creation form
│   │   │   ├── TasksTable.jsx     # Task list view
│   │   │   ├── EmployeeTask.jsx   # Employee task view
│   │   │   ├── ManagerTop.jsx     # Manager header
│   │   │   ├── EmployeeHeader.jsx # Employee header
│   │   │   ├── charts/            # Analytics charts
│   │   │   └── ...
│   │   ├── context/               # React Context providers
│   │   │   ├── themeContext.jsx   # Dark/light theme
│   │   │   ├── socketContext.jsx  # Socket.IO connection
│   │   │   └── useGetSocketMessage.js
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useEmail.js        # EmailJS integration
│   │   │   ├── useGetMessage.js   # Fetch messages
│   │   │   └── useSendMessage.js  # Send messages
│   │   ├── pages/                 # Route pages
│   │   │   ├── Login.jsx
│   │   │   ├── ManagerDash.jsx
│   │   │   └── EmployeeDash.jsx
│   │   ├── statemanagement/       # Zustand stores
│   │   │   ├── useAuth.js         # Auth state
│   │   │   └── useConversation.js # Chat state
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # React entry point
│   ├── public/                    # Static assets
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── screenshots/                   # Application screenshots
├── tech-svgs/                     # Technology logos
└── README.md
```

---

## 🚧 Future Enhancements

### Planned Features

#### Employee Experience
- [ ] **Employee Dashboard Summary** — Stats cards showing total assigned, completed, pending, overdue tasks, personal completion rate, and upcoming deadlines
- [ ] **Employee Task Activity Log** — Timestamped log of task events (assigned, started, completed, edited) visible to the employee

#### Task Workflow
- [ ] **Task Comments** — Thread-based discussions on individual tasks between manager and assigned employee
- [ ] **Multi-Step Task Status** — Expand status flow from `Pending → Completed` to `Pending → In Progress → Under Review → Completed` for better workflow visibility
- [ ] **Deadline Extension Requests** — Employees can request due date extensions with a reason; manager approves or rejects
- [ ] **Bulk Task Actions** — Multi-select tasks via checkboxes for bulk delete, reassign, or status change

#### Communication & Notifications
- [ ] **In-App Notification Center** — Bell icon with unread badge; real-time notifications for task assignments, completions, approaching deadlines, and new messages via Socket.IO
- [ ] **Task Due Date Reminders** — Automated reminder emails/notifications 24 hours before a task is due using a backend cron job
- [ ] **Group Chat / Team Channel** — Team-wide chat room for announcements and group discussion alongside existing 1-on-1 DMs

#### Visualization
- [ ] **Kanban Board View** — Drag-and-drop board as an alternate to the task table, with columns for each status



---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/ubet123/orgflow.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, commented code
   - Follow existing code style
   - Test thoroughly

4. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add task priority levels"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Contribution Guidelines
- ✅ Follow the existing folder structure
- ✅ Use meaningful variable and function names
- ✅ Add comments for complex logic
- ✅ Test on multiple screen sizes
- ✅ Update README if adding new features
- ✅ Keep commits atomic and focused

---



## 👨‍💻 Author

**Serene Dmello**
- 🌐 [Live Demo](https://org-flow-six.vercel.app/)
- 💼 [LinkedIn](https://www.linkedin.com/in/serene-dmello-572605344)
- 📧 Email: dmelloserene08@gmail.com

---

## 🙏 Acknowledgments

- **Socket.IO** for real-time communication
- **Cloudinary** for reliable file storage
- **EmailJS** for seamless email integration
- **MongoDB Atlas** for database hosting
- **Vercel** for frontend hosting
- **Tailwind CSS** for beautiful styling
- **React Community** for excellent documentation

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ using the MERN stack

</div>
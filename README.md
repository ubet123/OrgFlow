# 🏢 OrgFlow - Task & Chat Workspace

**OrgFlow** is a **MERN-based work management platform** for assigning tasks, tracking progress, and collaborating in real time. It combines role-based task workflows, file attachments, analytics, and a clean chat experience with a modern, professional UI.

👉 **[Live Demo](https://org-flow-six.vercel.app/)**

---

## 🎯 Purpose

OrgFlow helps teams:
- **Assign and track work** with clear ownership
- **Keep accountability visible** through status and due dates
- **Centralize collaboration** with built-in chat
- **Stay organized** with attachments and activity history

---

## 🛠️ Tech Stack

### Frontend
<table>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" /><br/>React
    </td>
    <td align="center">
      <img src="./tech-svgs/react-router-svgrepo-com.svg" width="40" height="40" alt="React Router" /><br/>React Router
    </td>
    <td align="center">
      <img src="https://axios-http.com/assets/logo.svg" width="40" height="40" alt="Axios" /><br/>Axios
    </td>
    <td align="center">
      <img src="./tech-svgs/tailwind-svgrepo-com.svg" width="40" height="40" alt="Tailwind CSS" /><br/>Tailwind CSS
    </td>
    <td align="center">
      <img src="https://vitejs.dev/logo.svg" width="40" height="40" alt="Vite" /><br/>Vite
    </td>
  </tr>
</table>

### Backend
<table>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js" /><br/>Node.js
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40" height="40" alt="Express.js" /><br/>Express.js
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40" height="40" alt="MongoDB" /><br/>MongoDB
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg" width="40" height="40" alt="Mongoose" /><br/>Mongoose
    </td>
    <td align="center">
      <img src="https://jwt.io/img/pic_logo.svg" width="40" height="40" alt="JWT" /><br/>JWT
    </td>
  </tr>
</table>

### Realtime + Storage
<table>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" width="40" height="40" alt="Socket.IO" /><br/>Socket.IO
    </td>
    <td align="center">
      <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/1/cloudinary-icon-ug0qqy8ms6ozyzy6cntbll.png/cloudinary-icon-hz05evx1htrghud89kpab4.png?_a=DATAiZAAZAA0" width="40" height="40" alt="Cloudinary" /><br/>Cloudinary
    </td>
  </tr>
</table>

### Development Tools
<table>
  <tr>
    <td align="center">
      <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" width="40" height="40" alt="Postman" /><br/>Postman
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" height="40" alt="Git" /><br/>Git
    </td>
    <td align="center">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="40" height="40" alt="GitHub" /><br/>GitHub
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="40" height="40" alt="ESLint" /><br/>ESLint
    </td>
  </tr>
</table>

---

## 👥 Roles & Core Features

### 👨‍💼 Manager Dashboard
- Create, edit, and delete tasks
- Assign tasks with due dates and attachments
- View employee task lists and analytics
- Manage employees
- Open chat with any employee

### 👩‍💻 Employee Dashboard
- View assigned tasks (pending + completed)
- Mark tasks as complete
- Access task attachments
- Chat with manager

### 🔐 Authentication
- JWT-based auth
- Role-aware routing and access controls

---

## 💬 Chat
- Real-time messaging with Socket.IO
- Online presence indicator
- Mobile-first chat view (list view and conversation view)

---

## 🎨 UI & Experience
- Dark/light theme support
- Polished, minimal layout designed for professional use
- Responsive across desktop, tablet, and mobile

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

## ⏰ Next Up
- Frontend email notifications via EmailJS
- File upload for task completion (employee)
- Analytics export
# 🏢 OrgFlow - Employee Task Management System  

**OrgFlow** is a **MERN stack application** that streamlines task assignment, tracking, and completion within organizations. With its **dark/light themed UI**, **mobile responsiveness**, and **data-driven analytics**, it provides managers, employees, and admins with an intuitive platform for efficient workflow management.  

👉 **[Live Demo](https://org-flow-six.vercel.app/)** 

---

## 🎯 Project Purpose  

This system enables organizations to:  
- **Digitize task management** from assignment to completion  
- **Improve accountability** with clear task ownership  
- **Track progress & productivity** through visual analytics  
- **Enhance efficiency** with email notifications and alerts  
- **Maintain records** of all task activities  

---

## 🛠️ Technology Stack  

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

### Additional Integrations  
<table>
  <tr>
    <td align="center">
      <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" width="40" height="40" alt="Nodemailer" /><br/>Nodemailer
    </td>
    <td align="center">
      <img src="./tech-svgs/material-ui-svgrepo-com.svg" width="40" height="40" alt="Recharts" /><br/>Material UI - Charts
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
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="40" height="40" alt="GitHub" /><br/>GitHub
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="40" height="40" alt="ESLint" /><br/>ESLint
    </td>
  </tr>
</table>

---

## 👥 User Roles & Features  

### 👨‍💼 Manager Dashboard  
- ✅ Create tasks with titles, descriptions, and due dates  
- ✅ Assign tasks to specific employees (**email notifications included**)  
- ✅ View & track all tasks with **status indicators**  
- ✅ Monitor overdue tasks visually  
- ✅ Personal chat with employees *(Upcoming)*  

### 👩‍💻 Employee Dashboard  
- ✅ View assigned tasks  
- ✅ Mark tasks as complete  
- ✅ See pending vs. completed tasks  
- ✅ Get **visual alerts** for overdue tasks  
- ✅ Receive **task assignment notifications** via email  

### 🔐 Authentication System  
- ✅ Secure login using **JWT authentication** for managers, employees, and admins  
- ✅ Role-based access control  

### 🛠️ Admin Features  
- ✅ Employee management (create/delete/edit)  
- ✅ Task oversight  
- ✅ System-wide controls  
- ✅ **Analytics Dashboard** with **pie chart & bar graph** for:  
  - Task completion rates  
  - Pending vs completed tasks distribution  
- ✅ **Email notifications** when employees mark tasks as complete  

---

## 🎨 UI & Experience  

- 🌗 **Dark/Light mode toggle** with local-storage-based theme persistence  
- 📱 **Mobile-responsive design** (optimized for all devices)  
- ⚡ **Smooth UX** with animations & instant feedback  

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

## ⏰ Upcoming Features  
- Real-time chat (employee ↔ manager)  
- Task Delete/Edit option ✅
- Due Date Reminder for Employee
- Task Completion Material Upload (for Employee)
- Analytics download feature - ✅
- Fix Email feature using Email.js library - ⏰
- Move the backend logic to controllers folder - ✅
- Improve Admin Authorization in backend for admin operations - ✅
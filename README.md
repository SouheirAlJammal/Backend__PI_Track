# **PI-Track: Time and Task Management Platform**

PI-Track is a feature-rich web application designed for efficient time and task management. Built using the MERN stack (MongoDB, Express, React, Node.js), it provides robust authentication, intuitive dashboards, and seamless collaboration tools.

---

## **Features**
- **User Authentication:** Secure JWT-based authentication with OAuth integration for Google login.
- **Task and Time Management:** Organize tasks and events using React Big Calendar.
- **Data Visualization:** Interactive charts with React ApexCharts for progress tracking.
- **File Uploads:** Multer integration for file uploads, utilizing S3 (Tebi endpoint) for image storage.
- **Invitation System:** Users can invite collaborators via email using NodeMailer.
- **Responsive Design:** Ensures optimal usability across devices.

---

## **Technologies Used**

- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT and Bcrypt
- **File Storage:** Multer-S3 with AWS S3 (or Tebi endpoint)
- **Mailing Service:** NodeMailer
- **Environment Variables:** dotenv for secure configurations

---

## **Installation**

### **Backend Setup**
1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/SouheirAlJammal/Backend_Final_Project.git
   cd backend
2. Install dependencies:
   ```bash
   npm install

3. Set up a .env file:
4. Start the development server
   ```bash
   npm run dev

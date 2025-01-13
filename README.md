# 🌐 **Samvaad**  
A real-time chat application designed for seamless communication, group conversations, and secure file sharing.

## 📑 **Table of Contents**  
- [📖 About](#about)
- [🎥 Demo Video](#demo-video) 
- [✨ Features](#features)  
- [💻 Tech Stack](#tech-stack)  
- [⚙️ Setup Instructions](#setup-instructions)  
- [🚀 Usage](#usage)  
 


---

## 📖 **About**  
Samvaad empowers users to engage in real-time individual and group conversations, with secure file-sharing capabilities to enhance communication and collaboration.


--- 

## 🎥 **Demo Video**  
[Click here to view the demo video](https://www.awesomescreenshot.com/video/35471799?key=f8d15118379295c223b7551769109e78)  



---

## ✨ **Features**  
- 🔴 **Real-Time Messaging:** Instant message updates powered by Socket.io  
- 👥 **Group Chat:** Engage in conversations with multiple users in a single thread  
- 📎 **File Sharing:** Share documents, images, and other files seamlessly  
- 🔐 **User Authentication:** Secure sign-in using JWT-based authentication  
- 📱 **Responsive UI:** Optimized for desktop and mobile views  
- 🗂 **Persistent Storage:** Messages and files are securely stored using PostgreSQL and Supabase  

---

## 💻 **Tech Stack**  

### **Frontend:**  
- ⚛️ React JS  
- 🟦 TypeScript  
- 🎨 Shadecn  
- 🗄️ Zustand  
- 🔑 JWT for Authentication  
- 🔁 Socket.io for Real-Time Communication  

### **Backend:**  
- 🟩 Node.js  
- ⚡ Express  
- 🐘 PostgreSQL  
- 📦 Supabase  
- 🔑 JWT for Secure Authentication  
- 🔁 Socket.io for Real-Time Updates  

---

## ⚙️ **Setup Instructions**  

### **Frontend Setup:**  
1. Clone the repository:  
   ```bash  
   git clone <your-repo-url>  
   cd frontend
2. Install dependencies
    ```bash
    npm install
    npm start  


### **Backend Setup:**  
1. Clone the repository:  
   ```bash  
   git clone <your-repo-url>  
   cd backend
2. Install dependencies
    ```bash
    npm install
    npm start

3. Configure environment variables in a .env file:
    ```bash
    DATABASE_URL=your_database_url
    JWT_SECRET=your_secret_key
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_key

4. Start the server
     ```bash
     npm start  

🚀 Usage
🔐 Sign up or log in to access the chat application.
👥 Create or join group chats for collaborative communication.
📎 Share files securely within chat threads.
🔁 Experience real-time updates as messages and files are exchanged.

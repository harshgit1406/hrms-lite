# HRMS-Lite

> A lightweight HR Management System built with a FastAPI backend and a React frontend.

🚀 **Live (Frontend)**: https://hrms-lite-henna-phi.vercel.app/  
🌐 **My Website / Portfolio**: https://harshgit1406.github.io/

---

## 📌 Project Overview

HRMS-Lite is a Human Resource Management System designed to help organizations manage employee data, attendance, roles and basic HR tasks through a modern web interface and REST API. The backend is built with **FastAPI** for fast, async-ready APIs, and the frontend is built with **React** for an interactive, responsive UI. It uses **PostgreSQL** as the database.

The project showcases a real-world full-stack application, with RESTful APIs for data operations and a frontend consuming those APIs to provide a smooth user experience.

---

## 🧰 Tech Stack

| Layer            | Technology         |
|------------------|-------------------|
| Backend          | FastAPI (Python)  |
| Frontend         | React             |
| Database         | PostgreSQL        |
| Deployment       | Railway (backend), Vercel (frontend) |
| Programming      | Python, JavaScript|

---

## 🛠 Features

✔ FastAPI REST API for backend logic  
✔ React SPA for user interface  
✔ PostgreSQL for data persistence   
✔ Deployed on **Railway + Vercel**

---

## 💻 Running Locally

Follow these steps to run HRMS-Lite on your machine:

### 1. Clone the Repository

```bash
git clone https://github.com/harshgit1406/hrms-lite.git
cd hrms-lite
```
### 2. Backend Setup
```bash
cd backend
uv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)
uv pip install -r requirements.txt
```

### Configure your environment variables (e.g., .env file):
```bash
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=hrmsdb
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/hrmsdb
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

This should start the React app on http://localhost:3000.

### 📦 Deployment
Frontend: Hosted on Vercel
🔗 https://hrms-lite-henna-phi.vercel.app/

Backend: Deployed via Railway


#### ❤️ Contributing

Pull requests are welcome!
Feel free to improve features, fix bugs, or add tests.
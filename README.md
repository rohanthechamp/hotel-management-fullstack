# Hotel Management System

A full-stack hotel internal management tool built with Django REST Framework and React.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT Authentication (Access + Refresh)
* Role-based access (Admin / Staff)
* Secure API endpoints

### 🏨 Core Functionality

* Booking management
* Cabin management
* Staff management system

### 👥 Staff Invite System

* Invite staff via secure tokens
* Controlled onboarding flow
* Role-based registration

### ⚡ Performance & Scalability

* Caching for optimized API responses
* Background task processing using Celery
* Efficient database querying and indexing

### 📊 Dashboard & Analytics

* Booking insights
* Sales & duration charts
* Real-time operational data

---

## 🛠 Tech Stack

### Backend

* Django
* Django REST Framework
* PostgreSQL (production)
* Celery (background tasks)
* Redis (caching & task broker)

### Frontend

* React (Vite)
* Axios
* Context API
* React Query

---

## 📂 Project Structure

Frontend and backend are separated:

* `Frontend/` → React application
* `myprojectBackend/` → Django REST API

---

## ⚙️ Setup Instructions

### Backend

```bash
cd myprojectBackend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

---

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔐 Authentication Note

* Access Token → localStorage
* Refresh Token → localStorage (temporary approach)
* Cookie-based authentication planned for production (HTTPS)

---

## 🚀 Deployment Plan

* Backend → Railway
* Frontend → Vercel
* Redis → for Celery & caching

---

## 📌 Status

Core system is functional and ready for deployment.
Advanced features like async tasks and caching are implemented.

---


📄 License

Open-source and available under the MIT License.

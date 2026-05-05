Markdown
# Hotel Management System

A full-stack hotel operations platform built with Django REST Framework and React.  
It manages cabins, bookings, guests, staff access, and invitation-based onboarding with JWT authentication.

## Live Demo
- Frontend: https://hotel-management-fullstack-ten.vercel.app
- Backend API: https://hotel-management-fullstack-production.up.railway.app

## Why I Built It
This project was built to simulate a real internal hotel management workflow:
- booking and cabin management
- role-based staff access
- secure authentication
- invitation-based onboarding
- performance-focused API design

## Core Features
- JWT authentication with access and refresh tokens
- Role-based access control for admin and staff
- Booking, cabin, and guest management
- Staff invite flow with token-based onboarding
- Dashboard analytics for bookings and stay duration
- Redis caching for performance
- Celery background tasks for async workflows
- Database indexing for query optimization

## Tech Stack
### Backend
- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- SimpleJWT

### Frontend
- React
- Vite
- Axios
- React Query
- Context API

### Deployment
- Railway for backend and database
- Vercel for frontend

## Architecture Notes
- Frontend and backend are separated
- API is served by Django REST Framework
- PostgreSQL stores production data
- Redis is used for caching and Celery task broker
- JWT is used for authentication
- Environment variables are used for production configuration

## Problems I Solved
- Fixed cross-origin issues between Vercel and Railway
- Debugged production 500 errors using Railway logs
- Handled JWT signing and token flow issues
- Separated deployment logic from data seeding logic
- Configured production database and cache services correctly

## Setup

### Backend
```bash
cd myprojectBackend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend
Bash
cd Frontend
npm install
npm run dev
```
License
MIT

# 🥘 Mealy — Food Ordering & Vendor Management App

**Mealy** is a full-stack web application that allows customers to order meals and helps caterers (food vendors) manage menus, track orders, and monitor sales efficiently.

---

## 🚀 Project Overview

Mealy bridges the gap between hungry customers and hardworking food vendors. It provides a seamless way for users to browse daily menus, place orders, and for caterers to manage meals, monitor demand, and track revenue — all in one intuitive system.

---

## 👥 Team & Tech Stack

- **Frontend**: React.js + Redux Toolkit  
- **Backend**: Python Flask  
- **Database**: PostgreSQL  
- **Wireframes**: Figma (Mobile-first design)  
- **Testing**: Jest (Frontend) & MiniTest/Pytest (Backend)

---

## ✅ Core Features

### 👤 User Functionality
1. Create an account and log in.
2. View the daily menu and select a meal option.
3. Change meal selection before order cutoff.
4. View personal order history.
5. Receive notifications when the menu is updated.

### 🧑‍🍳 Admin (Caterer) Functionality
1. Add, edit, or delete meal options (e.g. Beef with rice, Fries with chicken).
2. Create a menu for a specific day from available meal options.
3. View all customer orders for the day.
4. Track total revenue at the end of each day.
5. View full order history for business analysis.
6. Support for multiple caterers on the platform.

---

## 📦 Extra Features
- Order history view for both customers and admins.
- Real-time or scheduled menu update notifications.
- Scalable design supporting multiple vendors/caterers.

---

## 🛠️ Setup Instructions

### Backend (Flask + PostgreSQL)

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Run the server
flask run
## Frontend (React + Redux Toolkit with Vite)
bash
Copy
Edit
# Create project and install dependencies
npm create vite@latest mealy-frontend --template react
cd mealy-frontend
npm install react-redux @reduxjs/toolkit axios react-router-dom

# Start development server
npm run dev

##📁 Folder Structure
arduino
Copy
Edit
mealy-backend/
├── app/
│   ├── models.py
│   ├── routes/
│   └── ...
├── migrations/
├── run.py
└── requirements.txt

mealy-frontend/
├── src/
│   ├── features/
│   ├── components/
│   └── pages/
└── vite.config.js
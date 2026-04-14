# 🚀 DIFE Mini SaaS API

## 📌 Overview

DIFE Mini SaaS API is a backend system that simulates a **logistics intelligence platform**. It enables companies to manage drivers, assign routes, and analyze basic environmental risk associated with transportation.

This project is designed as a **multi-tenant SaaS system**, where multiple companies can independently manage their logistics operations.

---

## 🎯 Purpose

The goal of this project is to demonstrate real-world backend engineering skills, including:

* RESTful API design
* Authentication & authorization
* Multi-tenant architecture
* Clean code structure (controllers, services, routes)
* Scalable backend system design

---

## ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **JWT Authentication**
* **Render (Deployment)**
* **GitHub (Version Control)**

---

## 🏗️ System Architecture

User → Company → Drivers → Routes

Each user belongs to a company, and each company manages its own drivers and routes.

---

## 🔑 Core Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication

### 🏢 Multi-Tenant System

* Companies can manage their own data independently

### 🚚 Driver Management

* Create drivers
* View drivers per company

### 🛣️ Route Management

* Create routes
* Assign drivers to routes
* Track origin and destination

### ⚠️ Risk Calculation

* Each route has a calculated risk score
* Risk is based on simulated environmental data (mock logic)

---

## 🔌 API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Drivers

* GET /api/drivers
* POST /api/drivers

### Routes

* GET /api/routes
* POST /api/routes

### Risk

* GET /api/risk/:routeId

---

## 📊 Example Use Case

A logistics company can:

* Register and log in
* Add drivers
* Create delivery routes
* View risk scores for each route to make safer decisions

---

## 🌍 Deployment

The API is deployed on **Render**:

👉 Live URL: *(Add your Render link here)*

---

## 📁 Project Structure

src/
├── controllers/
├── services/
├── routes/
├── middleware/
├── config/
└── utils/

---

## 🧠 What I Learned

* Designing scalable backend systems
* Implementing authentication using JWT
* Structuring projects using service-based architecture
* Building multi-tenant SaaS logic

---

## 🚀 Future Improvements

* Integration with real weather APIs
* Air quality data integration
* Advanced route optimization
* Email notifications & automation system
* Frontend dashboard integration

---

## 🤝 Related Projects

* DIFE React Dashboard (Frontend)
* DIFE Automation System (Background jobs & scheduling)

---

## 👨‍💻 Author

D.O.I Henry

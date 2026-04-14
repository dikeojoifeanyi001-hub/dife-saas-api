# 🚀 DIFE Mini SaaS API

A production-ready backend SaaS API demonstrating **multi-tenant architecture**, **authentication**, and **logistics risk analysis**.

---

## 🌐 Live API

**Base URL:**
https://dife-saas-api-production.up.railway.app

👉 [API URL on Railway - Live](https://dife-saas-api-production.up.railway.app)

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* Railway (Deployment)

---

## 📚 Features

* 🔐 JWT Authentication (Login & Register)
* 🏢 Multi-tenant SaaS (Company-based data isolation)
* 🚚 Driver Management (CRUD operations)
* 🛣️ Route Management (Create & track routes)
* ⚠️ Risk Scoring System (0–100 scale)
* 🗄️ PostgreSQL Database (production-ready)

---

## 🏗️ Architecture

```
Client (React Dashboard)
        │
        ▼
DIFE SaaS API (Express.js)
 ├── Controllers (handle requests)
 ├── Services (business logic)
 └── Routes (API endpoints)
        │
        ▼
PostgreSQL Database
```

---

## 🧠 Risk Scoring Logic

Each route is assigned a **risk score (0–100)** based on simulated environmental factors.

| Level  | Score Range | Meaning                      |
| ------ | ----------- | ---------------------------- |
| Low    | 0 – 40      | Normal operations            |
| Medium | 41 – 70     | Monitor closely              |
| High   | 71 – 100    | Immediate attention required |

**Formula:**

```
risk_score = min((origin_length + destination_length) × 2.5, 100)
```

---

## 📡 API Endpoints

### 🔐 Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### 🏢 Companies

* GET `/api/companies/me`
* GET `/api/companies/stats`
* PUT `/api/companies/me`

### 🚚 Drivers

* POST `/api/drivers`
* GET `/api/drivers`
* GET `/api/drivers/:id`
* PUT `/api/drivers/:id`
* DELETE `/api/drivers/:id`

### 🛣️ Routes

* POST `/api/routes`
* GET `/api/routes`
* GET `/api/routes/:id`
* PUT `/api/routes/:id`
* DELETE `/api/routes/:id`

### ⚠️ Risk

* GET `/api/risk`
* GET `/api/risk/:routeId`

---

## 🧪 API Examples

### 🔹 Register User

```bash
curl -X POST https://dife-saas-api-production.up.railway.app/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "companyName": "Logistics Co"
}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

---

### 🔹 Create Driver

```bash
curl -X POST https://dife-saas-api-production.up.railway.app/api/drivers \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"name": "Driver One"}'
```

---

### 🔹 Get Routes

```bash
curl -X GET https://dife-saas-api-production.up.railway.app/api/routes \
-H "Authorization: Bearer YOUR_TOKEN"
```

---

## ❌ Error Handling

The API returns standard HTTP status codes:

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 404  | Not Found    |
| 500  | Server Error |

Example:

```json
{
  "error": "Invalid token"
}
```

---

## 💻 Run Locally

### Prerequisites

* Node.js (v18+)
* PostgreSQL (optional — SQLite supported)

### Setup

```bash
git clone https://github.com/dikeojoifeanyi001-hub/dife-saas-api.git
cd dife-saas-api
npm install
```

Create `.env` file:

```
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_url
```

Run the app:

```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── config/        # Database setup
├── controllers/   # Request handlers
├── services/      # Business logic
├── routes/        # API routes
├── middleware/    # Auth middleware
└── utils/         # Helper functions
```

---

## 🔜 Upcoming Projects

* React Dashboard (Frontend UI)
* Automation System (Background jobs & scheduling)

---

## 👨‍💻 Author

**D.O.I Henry**
Backend / Full Stack Developer

* GitHub: https://github.com/dikeojoifeanyi001-hub

---

## 📄 License

MIT License — free for learning and portfolio use.

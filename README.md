# DIFE SaaS API

Production-grade multi-tenant backend system for logistics intelligence. Designed with real-world SaaS architecture, authentication, and risk analysis workflows.

---

## 🚀 Live API

**Base URL:**
https://dife-saas-api-production.up.railway.app

Test in browser or with Postman/cURL.

---

## 📌 Overview

DIFE SaaS API simulates a real logistics platform where companies manage drivers, assign routes, and monitor environmental risk.

The system is built as a **multi-tenant SaaS**, ensuring each company operates with isolated data and secure access.

---

## ⚡ Core Features

* Multi-tenant architecture (company-level data isolation)
* JWT-based authentication (stateless)
* Role-based access control
* Driver and route management (CRUD)
* Risk scoring engine (0–100)
* PostgreSQL production database
* Deployed on Railway

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express
* **Database:** PostgreSQL
* **Authentication:** JWT, bcrypt
* **Deployment:** Railway

---

## 🧠 Architecture

Client (Dashboard) → API (Controllers → Services) → Database (PostgreSQL)

* Controllers handle HTTP requests
* Services contain business logic
* Database stores company, driver, and route data

---

## 📡 API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Companies

* GET `/api/companies/me`
* GET `/api/companies/stats`
* PUT `/api/companies/me`

### Drivers

* POST `/api/drivers`
* GET `/api/drivers`
* GET `/api/drivers/:id`
* PUT `/api/drivers/:id`
* DELETE `/api/drivers/:id`

### Routes

* POST `/api/routes`
* GET `/api/routes`
* GET `/api/routes/:id`
* PUT `/api/routes/:id`
* DELETE `/api/routes/:id`

### Risk

* GET `/api/risk`
* GET `/api/risk/:routeId`

---

## 🧪 Example Usage

### Register

```bash
curl -X POST https://dife-saas-api-production.up.railway.app/api/auth/register 
-H "Content-Type: application/json" 
-d '{"name":"John","email":"[john@example.com](mailto:john@example.com)","password":"123456","companyName":"Logistics Co"}'
```

### Login

```bash
curl -X POST https://dife-saas-api-production.up.railway.app/api/auth/login 
-H "Content-Type: application/json" 
-d '{"email":"[john@example.com](mailto:john@example.com)","password":"123456"}'
```

### Create Driver

```bash
curl -X POST https://dife-saas-api-production.up.railway.app/api/drivers 
-H "Authorization: Bearer TOKEN" 
-H "Content-Type: application/json" 
-d '{"name":"Driver One"}'
```

---

## 🧠 Risk Scoring Logic

```js
risk_score = Math.min((origin.length + destination.length) * 2.5, 100)
```

| Level  | Score  | Meaning          |
| ------ | ------ | ---------------- |
| Low    | 0–40   | Normal           |
| Medium | 41–70  | Monitor          |
| High   | 71–100 | Immediate action |

---

## ⚙️ Local Development

```bash
git clone https://github.com/dikeojoifeanyi001-hub/dife-saas-api.git
cd dife-saas-api
npm install
cp .env.example .env
node setup-db.js
npm run dev
```

---

## 🔐 Environment Variables

```env
PORT=5000
JWT_SECRET=your_secret
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

---

## 📁 Structure

```
src/
controllers/
services/
routes/
middleware/
config/
utils/
```

---

## 🚀 Deployment

Deployed on Railway with auto-deploy from GitHub.

---

## 🔗 Related Projects

* Dashboard: https://dife-dashboard.pages.dev
* Automation: https://dife-automation.dikeojo-ifeanyi001.workers.dev/run-jobs

---

## 👨‍💻 Author

D.O.I Henry
GitHub: https://github.com/dikeojoifeanyi001-hub
Portfolio: https://doi-henry-portfolio.pages.dev

---

## 📄 License

MIT

# 🏎️ AutoBolt — Client Panel

Welcome to the frontend application of **AutoBolt**, a premium, responsive, and responsive automotive enterprise application. Featuring beautiful dark-mode acoustics, harmonious orange-accented themes, glassmorphism UI widgets, and comprehensive user role workspaces.

---

## ✨ Key Features & User Workspaces

The application delivers tailored dashboards and workflows across three distinct system roles:

### 👑 1. Administrator Panel
* **Financial Management**: Oversee operational performance, create purchase invoices, check overdue vendor lines, and manage invoices with automatic 13% VAT calculations.
* **Staff Registrations**: Provision new staff members with secure token-linked setup invitations.
* **Business Analytics**: High-fidelity reports displaying sales trends, peak service times, and staff performance metrics.

### 🔧 2. Staff Panel
* **Customer Intake**: Check incoming vehicle listings, register new customers, and update details.
* **Bookings Workspace**: Manage real-time appointment logs and update diagnostic statuses.
* **Billing & Checkout**: Build interactive checkout sheets, add multiple custom parts, apply discounts, and instantly generate invoice receipts.

### 👤 3. Customer Panel
* **Parts Catalog**: Browse replacement auto components, filter by category, and check pricing.
* **Booking Center**: Schedule diagnostic appointments or periodic services with dynamic booking logs.
* **Security & Profile**: Edit profile details, change passwords, and complete dual-method OTP verification flows.

---

## 🎨 Design System & Aesthetics

* **Color Palette**: Dark automotive background palette, complemented with vibrant HSL orange highlights (`#ea580c`) and polished typography (Inter font).
* **Glassmorphism Panels**: Semi-transparent, blur-filtered containers creating depth and sleek professional layering.
* **Micro-Animations**: Hover animations on action buttons, smooth sidebar expansion states, and fluid page transitions.
* **Fully Responsive**: Adapts dynamically across desktops, tablets, and mobile screens.

---

## 🛠️ Technical Stack

* **Core Library**: React.js 19
* **Build System**: Vite.js
* **Styling Engine**: Custom Vanilla CSS (designed for performance, clean layouts, and complete responsive control)
* **API Communication**: Axios client equipped with request interceptors to automatically append JWT Bearer tokens and gracefully catch/redirect unauthorized `401` states.

---

## 🏃 Getting Started & Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* Running [AutoBolt Web API Backend](https://github.com/Sirson39/AutoBolt_backend.git)

### 1. Installation
Clone the repository and install all necessary npm dependencies:
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the frontend root directory to direct API requests to your active backend server:
```env
VITE_API_URL=http://localhost:5098
```

### 3. Start Development Server
Boot up the Vite server locally:
```bash
npm run dev
```
Open the local URL shown in your terminal, usually **`http://localhost:5173`**.

### 4. Build Production Bundle
To build high-performance compiled static assets ready for deployment:
```bash
npm run build
```
The compiled output is created inside the `dist/` directory, which can be served by any static file server or hosted directly within the backend's `/wwwroot` hosting directory.

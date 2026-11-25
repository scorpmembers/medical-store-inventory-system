# Medical Store Inventory and Sales Management System (MedStore IMS)

A full-stack, enterprise-grade web application designed for retail pharmacies, chemist shops, and medical stores to manage inventory, batch expiration surveillance, purchases, point-of-sale (POS) billing, supplier directories, and role-based staff access.

Developed as a **B.Tech Final-Year Major Project**.

---

## 🚀 Technology Stack

### **Backend**
- **Framework:** Spring Boot (v3.3.5)
- **Language:** Java 17+
- **Security:** Spring Security 6 with BCrypt Password Hashing & Stateless JWT Authentication
- **Persistence:** Spring Data JPA / Hibernate ORM
- **Database:** MySQL Server 8.0+ (`medical_store_db`)
- **Build Tool:** Apache Maven
- **Port:** `8080`

### **Frontend**
- **Library:** React.js (v18)
- **Language:** JavaScript (ES6+, JSX) — *No TypeScript*
- **Styling:** Tailwind CSS (v3) with Custom Pharmacy Palette
- **Icons:** Lucide React
- **Build & Dev Tool:** Vite
- **Port:** `3000` (or `5173`)

---

## 📂 Project Architecture

```
medical-store-inventory-system/
├── backend/                               # Spring Boot Application
│   ├── pom.xml                            # Maven dependencies (Web, JPA, Security, MySQL, JJWT)
│   ├── schema.sql                         # MySQL database & table creation script
│   └── src/
│       ├── main/
│       │   ├── java/com/medstore/
│       │   │   ├── MedicalStoreApplication.java   # Spring Boot entry point
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java        # Security filter chain, CORS & endpoint authorization
│       │   │   │   └── DataInitializer.java       # Auto-seeds default Admin & Staff accounts
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java        # /api/auth (signup, login, me)
│       │   │   │   ├── AdminUserController.java   # /api/admin/staff (user management)
│       │   │   │   └── StaffDashboardController.java # /api/staff/permissions
│       │   │   ├── dto/                       # Request & Response Data Transfer Objects
│       │   │   │   ├── SignupRequest.java
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── AuthResponse.java
│       │   │   │   ├── UserDto.java
│       │   │   │   ├── CreateStaffRequest.java
│       │   │   │   └── ApiResponse.java
│       │   │   ├── exception/
│       │   │   │   └── GlobalExceptionHandler.java # Centralized JSON error response handler
│       │   │   ├── model/
│       │   │   │   ├── Role.java              # Enum: ROLE_ADMIN, ROLE_STAFF
│       │   │   │   └── User.java              # JPA Entity for MySQL 'users' table
│       │   │   ├── repository/
│       │   │   │   └── UserRepository.java    # Spring Data JPA queries
│       │   │   ├── security/
│       │   │   │   ├── CustomUserDetails.java
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   ├── JwtAuthenticationEntryPoint.java
│       │   │   │   ├── JwtAuthenticationFilter.java  # Validates Bearer token on requests
│       │   │   │   └── JwtUtil.java               # Generates & parses HMAC-SHA256 JWTs
│       │   │   └── service/
│       │   │       ├── AuthService.java           # Signup & login business logic
│       │   │       └── AdminUserService.java      # Staff creation & account control
│       │   └── resources/
│       │       └── application.properties     # MySQL datasource & JWT configuration
│       └── test/
│           └── java/com/medstore/
│               └── AuthServiceTest.java       # Unit tests for signup, duplicate check & BCrypt
│
├── src/                                   # React.js Frontend Application
│   ├── App.jsx                            # Main layout & route controller
│   ├── main.jsx                           # React root with StoreProvider
│   ├── components/
│   │   ├── Navbar.jsx                     # Top navigation, live clock & user role pill
│   │   ├── Sidebar.jsx                    # Role-aware sidebar navigation
│   │   ├── Modal.jsx                      # Reusable dialog modal
│   │   ├── Toast.jsx                      # Floating alert notifications
│   │   ├── StatsCard.jsx                  # KPI metric card
│   │   ├── Badge.jsx                      # Stock & expiry status badges
│   │   └── InvoiceModal.jsx               # Printable tax invoice receipt
│   ├── context/
│   │   └── StoreContext.jsx               # Master React context with JWT auth integration
│   ├── pages/
│   │   ├── LoginPage.jsx                  # Login & Staff Registration tabs
│   │   ├── DashboardPage.jsx              # Role-aware control center
│   │   ├── MedicinesPage.jsx              # Medicine master catalog (Admin add/edit/delete; Staff view)
│   │   ├── InventoryPage.jsx              # Batch lot & expiry tracker (locked expired batches)
│   │   ├── SalesPage.jsx                  # Point of sale & billing counter
│   │   ├── PurchasesPage.jsx              # Stock procurement (Admin only)
│   │   ├── SuppliersPage.jsx              # Distributor directory (Admin manage; Staff view)
│   │   ├── ReportsPage.jsx                # Financial analytics & turnover (Admin only)
│   │   └── StaffManagementPage.jsx        # User & staff credential management (Admin only)
│   ├── services/
│   │   └── api.js                         # Centralized fetch client communicating with backend
│   └── utils/
│       └── formatters.js                  # Currency (₹), date, and expiry calculation helpers
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

### **Role Permissions Matrix**

| Feature / Operation | Administrator (`ROLE_ADMIN`) | Staff / Pharmacist (`ROLE_STAFF`) | Enforcement |
| :--- | :---: | :---: | :--- |
| **Login to System** | ✅ Yes | ✅ Yes | Spring Security DB Auth |
| **Point of Sale (Billing Counter)** | ✅ Yes | ✅ Yes | Both roles authorized |
| **View Medicines & Search Batches** | ✅ Yes | ✅ Yes | Both roles authorized |
| **Add / Edit / Delete Medicines** | ✅ Full Access | ❌ Restricted | UI action hidden & backend protected |
| **Inward Stock Purchases** | ✅ Full Access | ❌ Restricted | Admin only tab in sidebar |
| **Manage Suppliers** | ✅ Full Access | ❌ Read Only | UI action hidden & backend protected |
| **View Financial Reports & Margins** | ✅ Full Access | ❌ Blocked | Route guard & permission notice |
| **Staff & User Account Management** | ✅ Full Access | ❌ Blocked | Backend `@PreAuthorize("hasAuthority('ROLE_ADMIN')")` |

---

## 👤 Initial Admin Account & Staff Account Setup

### **How the First Admin Account is Created (Task 6)**
1. **Automated Seeding (`DataInitializer.java`):**
   - On the very first startup of the Spring Boot application, `DataInitializer` checks the MySQL database.
   - If no user with `ROLE_ADMIN` exists, it automatically creates the primary Administrator account:
     - **Email:** `admin@medstore.com`
     - **Password:** `Admin@123`
     - **Role:** `ROLE_ADMIN`
     - **Password Hashing:** Encrypted via BCrypt (`$2a$10$...`) before saving to MySQL.
2. **Database Script (`backend/schema.sql`):**
   - Alternatively, you can execute `backend/schema.sql` in MySQL Workbench or phpMyAdmin to pre-populate the initial Admin account.

### **How Public Staff Accounts are Created**
- Anyone can click the **"Register (Staff)"** tab on the Login page.
- Fields: Full Name, Email, Phone, Password, Confirm Password.
- **Security Rule:** Public signup strictly assigns `ROLE_STAFF`. Users **cannot** select or elevate themselves to `ROLE_ADMIN`.
- System enforces validation: passwords must match, minimum 6 characters, and duplicate emails are rejected.

### **How Administrator Creates & Manages Staff Accounts**
- Log in as Admin (`admin@medstore.com`).
- Navigate to **"Staff & Users"** in the sidebar.
- Click **"+ Add New Staff"** to create a staff account directly.
- The Administrator can also **Activate/Deactivate** any staff member with one click or **Delete** former staff accounts.

---

## 🛠️ Step-by-Step Installation & Running Guide

### **Step 1: Configure & Start MySQL Database**
1. Ensure your MySQL server service is running on port `3306`.
2. Create the database (or let Spring Boot create it automatically):
   ```sql
   CREATE DATABASE IF NOT EXISTS medical_store_db;
   ```
3. Open `backend/src/main/resources/application.properties` and verify your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/medical_store_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   *(Change `root` to your MySQL username and password if different, or set environment variables `DB_USERNAME` and `DB_PASSWORD`).*

---

### **Step 2: Start the Spring Boot Backend**
1. Open a terminal in the `backend` folder:
   ```bash
   cd "d:\Project A\medical-store-inventory-system\backend"
   ```
2. Build and run the backend using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Or open `backend/pom.xml` in IntelliJ IDEA / Eclipse / VS Code and click Run on `MedicalStoreApplication.java`).*
3. The backend will start on **http://localhost:8080**.
   - You will see the console log:
     ```
     Default Admin account created successfully!
     Email:    admin@medstore.com
     Password: Admin@123
     Role:     ROLE_ADMIN
     ```

---

### **Step 3: Start the React Frontend**
1. Open a new terminal in the project root directory:
   ```bash
   cd "d:\Project A\medical-store-inventory-system"
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🧪 Testing Guide for Project Viva & Demonstration

### **Test 1: Public Staff Signup**
1. Go to the login page and click **"Register (Staff)"**.
2. Fill in:
   - **Name:** Rohit Sharma
   - **Email:** `rohit@medstore.com`
   - **Password:** `Rohit@123`
   - **Confirm Password:** `Rohit@123`
3. Click **"Register as Staff"**.
4. Notice you are logged in immediately as **Rohit Sharma**, with the **STAFF** badge displayed in the sidebar.
5. In MySQL, run `SELECT * FROM users;` to show your professor that the password is stored as a secure BCrypt hash (`$2a$10$...`) and role is `ROLE_STAFF`.

### **Test 2: Duplicate Email Rejection**
1. Try signing up again using `rohit@medstore.com`.
2. The backend rejects the request with HTTP 400: `"Email 'rohit@medstore.com' is already registered. Please log in or use another email."`

### **Test 3: Incorrect Password Handling**
1. Log out.
2. Enter email `admin@medstore.com` and an incorrect password (e.g., `WrongPass123`).
3. Click Sign In. The system displays: `"Invalid email or password."`

### **Test 4: Staff Role Restrictions**
1. Log in as Staff (`staff@medstore.com` / `Staff@123`).
2. Notice:
   - "Staff & Users" management tab is **hidden** from the sidebar.
   - "Stock Purchases" tab is **hidden**.
   - In "Medicines", the "+ Add New Medicine" and Delete buttons are **hidden**.
   - Staff can freely access the **Sales (Billing POS)** counter, add medicines, and complete sales receipts.

### **Test 5: Administrator Account & Staff Management**
1. Log out and log in as Admin (`admin@medstore.com` / `Admin@123`).
2. Notice:
   - Full dashboard access, financial turnover, KPI cards, and reports.
   - Click **"Staff & Users"** in the sidebar.
   - View the table of all registered staff accounts.
   - Click **"Deactivate"** or **"Add New Staff"** to demonstrate complete administrative control.

---

## 🏆 Project Viva Highlights for Mentor & External Examiner

1. **Why BCrypt over MD5 or SHA-256?**
   - BCrypt includes a cryptographic salt and work-factor (10 rounds) that protects against rainbow table attacks and brute force.
2. **Why JWT (JSON Web Tokens)?**
   - Stateless authentication allows horizontal scaling without storing server-side session state in memory.
3. **Defense in Depth:**
   - Both frontend UI guards and backend Spring Security method-level annotations (`@PreAuthorize("hasAuthority('ROLE_ADMIN')")`) are implemented to ensure APIs cannot be bypassed by external tools like Postman or cURL.

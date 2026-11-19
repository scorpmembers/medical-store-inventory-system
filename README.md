# medical-store-inventory-system

A web-based Medical Store Inventory System built using React.js, Java Spring Boot, and MySQL to manage medicines, stock, purchases, sales, expiry alerts, and reports efficiently.

# Medical Store Inventory System (MedStore IMS)

A clean, modern, and professional web-based pharmacy management and inventory system frontend built for college major project demonstrations.

---

## 🚀 Technology Stack

- **Frontend Library:** React.js (v18)
- **Language:** JavaScript (ES6+, JSX) — _No TypeScript_
- **Styling:** Tailwind CSS (v3)
- **Icons:** Lucide React
- **Build Tool / Dev Server:** Vite
- **Storage:** LocalStorage (State persists across page reloads)

---

## 🩺 System Features & Pages

### 1. Demo Login Page (`src/pages/LoginPage.jsx`)

- Clean pharmacy staff login interface.
- One-click demo login buttons:
  - **Pharmacist Demo:** `pharmacist@medstore.com`
  - **Admin Demo:** `admin@medstore.com`
- Session state persisted to `localStorage` with a Logout button in the sidebar.

### 2. Dashboard (`src/pages/DashboardPage.jsx`)

- **Key Performance Cards (KPIs):**
  - Total registered medicines count.
  - Total units in stock across all batches.
  - Today's sales turnover (₹) and bill count.
  - Low-stock safety threshold alerts.
  - Near-expiry and expired drug alerts.
- **7-Day Sales Overview Chart:** Visual daily turnover and order volume bars with tooltips.
- **Therapy Category Breakdown:** Stock distribution by category (Antibiotics, Analgesics, GI Care, etc.).
- **Urgent Expiry & Low Stock Banner:** Highlights locked expired batches and near-expiry items with quick links.
- **Recent Sales Activity Table:** Latest customer transactions with quick receipt view.

### 3. Medicines Catalog (`src/pages/MedicinesPage.jsx`)

- Comprehensive table displaying:
  - Medicine brand name, generic formulation, dosage form, manufacturer, ID.
  - Storage rack location (e.g., `Rack A-1`, `Rack B-2`).
  - Active batch count and total available stock.
  - Purchase cost, selling MRP, and calculated margin.
  - Expiry status badge.
- Real-time text search (searches brand name, generic name, rack, or manufacturer).
- Category filter dropdown.
- Stock level filter (In Stock, Low Stock Alert, Out of Stock).
- **Add New Medicine Modal:** Allows adding medicine master details plus an optional initial batch lot.
- **Edit & Delete Actions:** Modify medicine details or remove items.

### 4. Batch Inventory & Expiry Surveillance (`src/pages/InventoryPage.jsx`)

- Batch-wise inventory table showing:
  - Batch number, medicine name, distributor.
  - Current physical quantity on shelf.
  - Manufacturing date, expiration date, and exact days remaining.
  - Expiry status badge (Good, Near Expiry ≤ 90 days, Expired).
  - **Sales Eligibility Badge:** Clear `ELIGIBLE` or `BLOCKED` status.
- Quick filter tabs for **Expired Only**, **Near Expiry Only**, **Low Stock**, and **Valid Batches**.
- **Add Inward Batch Modal:** Directly add new stock lots to existing medicines.

### 5. Point of Sale (POS) & Billing (`src/pages/SalesPage.jsx`)

- Interactive, counter-friendly retail billing form:
  - Customer name, mobile phone number, and prescribing doctor.
  - Medicine selector and batch selector with live stock indicators.
  - **Expiry Lock Protection:** Automatically disables and flags expired batches (`[EXPIRED - CANNOT SELL]`).
  - **Stock Limit Validation:** Restricts quantity to available batch stock.
  - Multi-item cart support (bill multiple medicines on one invoice).
  - Live calculation of subtotal, discount, and grand total.
  - Payment mode selector (Cash, UPI, Card).
- **Instant Stock Deduction:** Submitting a sale immediately decreases physical quantity from that batch lot in `localStorage`.
- **Printable Tax Invoice Receipt Modal (`src/components/InvoiceModal.jsx`):** Generates clean, branded bills with pharmacy drug license numbers, itemized breakdown, and print capability.
- **Sales History Audit Log:** Search past invoices, customer details, and reprint receipts.

### 6. Purchases & Stock Inward (`src/pages/PurchasesPage.jsx`)

- Record inward medicine consignments received from distributors.
- Select supplier, select medicine, enter batch lot, quantity, purchase price, MRP, and expiry date.
- **Automatic Stock Replenishment:** Saving a purchase instantly adds or increments batch inventory in the system.
- Inward purchase register with invoice numbers, supplier names, unit rates, and total costs.

### 7. Suppliers Directory (`src/pages/SuppliersPage.jsx`)

- Registered pharmaceutical distributors (e.g., _Apex Health Logistics_, _Sun BioCare_, _MedVantage_).
- Contact person, phone number, email, GSTIN, and physical warehouse address.
- Add new supplier, edit supplier details, and delete entries.
- Displays historical inward purchase count per supplier.

### 8. Reports & Analytics (`src/pages/ReportsPage.jsx`)

- Financial KPI summaries:
  - Gross sales turnover.
  - Total inventory valuation at cost vs. at retail MRP.
  - Projected profit margin calculation (~28.5%).
- **Weekly Turnover Chart:** 7-day revenue comparison.
- **Monthly Progression Chart:** 6-month historical turnover vs. procurement costs.
- **Fast-Moving Medicines:** Top items ranked by units sold and revenue.
- **Slow-Moving / Dead Stock Watchlist:** Low turnover medicines at risk of expiration.
- Export to CSV simulation and print summary report.

---

## 📁 Project Architecture & Folder Structure

```
medical-store-inventory-system/
├── index.html                 # Main HTML file with Google Inter font
├── package.json               # Dependencies and build scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS custom palette & configuration
├── vite.config.js             # Vite configuration with React plugin
├── src/
│   ├── main.jsx               # Application entry point with StoreProvider
│   ├── App.jsx                # Root router / layout manager
│   ├── index.css              # Global styles & Tailwind directives
│   ├── context/
│   │   └── StoreContext.jsx   # Centralized React state management & localStorage sync
│   ├── data/
│   │   └── initialData.js     # Realistic sample data (medicines, batches, suppliers, sales)
│   ├── utils/
│   │   └── formatters.js      # Currency (₹), date, and expiry calculation helpers
│   ├── components/
│   │   ├── Navbar.jsx         # Header with live clock, notifications dropdown, POS shortcut
│   │   ├── Sidebar.jsx        # Responsive navigation with badge alerts and reset button
│   │   ├── Modal.jsx          # Reusable accessible dialog component
│   │   ├── Toast.jsx          # Toast alert notifications (success, error, warning, info)
│   │   ├── StatsCard.jsx      # Clean metric summary card
│   │   ├── Badge.jsx          # Stock status and expiry status badges
│   │   ├── Charts.jsx         # Clean, responsive SVG/CSS charts
│   │   └── InvoiceModal.jsx   # Printable tax invoice receipt modal
│   └── pages/
│       ├── LoginPage.jsx      # Staff authentication demo
│       ├── DashboardPage.jsx  # Control center & overview
│       ├── MedicinesPage.jsx  # Medicine master catalog
│       ├── InventoryPage.jsx  # Batch & expiry surveillance
│       ├── SalesPage.jsx      # Point of Sale & billing
│       ├── PurchasesPage.jsx  # Stock procurement register
│       ├── SuppliersPage.jsx  # Supplier directory
│       └── ReportsPage.jsx    # Analytics & sales velocity
```

---

## 🛠️ How to Run Locally

### Prerequisites

- Node.js (version 18 or newer)
- npm (version 9 or newer)

### Installation & Startup

1. Open a terminal in the project directory:
   ```bash
   cd medical-store-inventory-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🧪 College Project Viva & Demo Highlights

When presenting this project to your professor or mentor, you can demonstrate these key business logic features:

1. **Expiry Block Simulation:**
   - Go to **Point of Sale (Sales Page)**.
   - Select _Augmentin 625 Duo_. Notice that Batch `#AUG-71A` is marked `[EXPIRED - CANNOT SELL]` and is disabled.
   - Show how the system prevents pharmacists from dispensing expired medication to patients.
2. **Real-Time Stock Deduction:**
   - Look at the available units for _Dolo 650mg_ (Batch `#DL-24A1`).
   - Bill 5 units to a customer and complete the sale.
   - Show that stock immediately decreases by 5 units across the Dashboard, Medicines, and Inventory pages.
3. **Inward Stock Replenishment:**
   - Go to **Purchases** and record an inward delivery for 50 units.
   - Show that the batch quantity in **Inventory** automatically increases.
4. **Persistence & Reset:**
   - Refresh the browser to prove changes persist in `localStorage`.
   - Click **Reset Demo Data** in the sidebar to cleanly reset all records back to their initial state for another demo.

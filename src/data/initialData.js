// Sample data for Medical Store Inventory System
// Contains realistic Indian pharmacy medicines, suppliers, batches, and transactions

export const INITIAL_CATEGORIES = [
  'All',
  'Antibiotics',
  'Analgesics & Pain Relief',
  'Antacids & GI Care',
  'Antidiabetic',
  'Antihistamines & Allergy',
  'Cardiovascular & BP',
  'Respiratory & Cough',
  'Vitamins & Supplements'
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'SUP-001',
    name: 'Apex Health Logistics',
    contactPerson: 'Rajesh Sharma',
    phone: '+91 98230 45671',
    email: 'orders@apexhealth.in',
    address: 'Plot 42, Pharma Hub, Okhla Phase III, New Delhi',
    gstin: '07AAAAA1234A1Z5',
    status: 'Active'
  },
  {
    id: 'SUP-002',
    name: 'Sun BioCare Distributors',
    contactPerson: 'Sunita Patel',
    phone: '+91 98450 11223',
    email: 'supply@sunbiocare.com',
    address: 'B-14, Industrial Area, Sector 62, Noida, UP',
    gstin: '09BBBBB2345B2Z6',
    status: 'Active'
  },
  {
    id: 'SUP-003',
    name: 'MedVantage Pharmaceuticals',
    contactPerson: 'Anand Kulkarni',
    phone: '+91 97110 88990',
    email: 'sales@medvantage.co.in',
    address: 'Warehouse 9, Transport Nagar, Jaipur, Rajasthan',
    gstin: '08CCCCC3456C3Z7',
    status: 'Active'
  },
  {
    id: 'SUP-004',
    name: 'Zenith Chem & Labs',
    contactPerson: 'Vikas Verma',
    phone: '+91 98765 43210',
    email: 'contact@zenithlabs.in',
    address: 'G-12, Ring Road Commercial Complex, Gurugram, Haryana',
    gstin: '06DDDDD4567D4Z8',
    status: 'Active'
  },
  {
    id: 'SUP-005',
    name: 'CureWell Lifesciences',
    contactPerson: 'Dr. Meera Iyer',
    phone: '+91 99887 66554',
    email: 'distribution@curewelllife.com',
    address: 'Unit 5, Pharma City, Hyderabad, Telangana',
    gstin: '36EEEEE5678E5Z9',
    status: 'Active'
  }
];

export const INITIAL_MEDICINES = [
  {
    id: 'MED-101',
    name: 'Dolo 650mg',
    genericName: 'Paracetamol 650mg',
    category: 'Analgesics & Pain Relief',
    dosage: 'Tablet',
    manufacturer: 'Micro Labs Ltd',
    rackLocation: 'Rack A-1',
    unit: 'Strip (15 tabs)',
    minStockAlert: 20,
    description: 'Relief from fever, mild to moderate body pain and headache'
  },
  {
    id: 'MED-102',
    name: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin & Potassium Clavulanate',
    category: 'Antibiotics',
    dosage: 'Tablet',
    manufacturer: 'GlaxoSmithKline (GSK)',
    rackLocation: 'Rack A-3',
    unit: 'Strip (10 tabs)',
    minStockAlert: 15,
    description: 'Broad-spectrum antibiotic for bacterial infections'
  },
  {
    id: 'MED-103',
    name: 'Pan 40',
    genericName: 'Pantoprazole Sodium 40mg',
    category: 'Antacids & GI Care',
    dosage: 'Tablet',
    manufacturer: 'Alkem Laboratories',
    rackLocation: 'Rack B-2',
    unit: 'Strip (15 tabs)',
    minStockAlert: 25,
    description: 'Proton pump inhibitor for acidity, GERD and gastric ulcers'
  },
  {
    id: 'MED-104',
    name: 'Glycomet 500 SR',
    genericName: 'Metformin Hydrochloride 500mg',
    category: 'Antidiabetic',
    dosage: 'Tablet',
    manufacturer: 'USV Pvt Ltd',
    rackLocation: 'Rack C-1',
    unit: 'Strip (20 tabs)',
    minStockAlert: 30,
    description: 'First-line anti-hyperglycemic drug for Type 2 Diabetes'
  },
  {
    id: 'MED-105',
    name: 'Montair LC',
    genericName: 'Montelukast Sodium + Levocetirizine',
    category: 'Antihistamines & Allergy',
    dosage: 'Tablet',
    manufacturer: 'Cipla Ltd',
    rackLocation: 'Rack B-4',
    unit: 'Strip (10 tabs)',
    minStockAlert: 15,
    description: 'Relief from allergic rhinitis and asthma symptoms'
  },
  {
    id: 'MED-106',
    name: 'Telma 40',
    genericName: 'Telmisartan 40mg',
    category: 'Cardiovascular & BP',
    dosage: 'Tablet',
    manufacturer: 'Glenmark Pharmaceuticals',
    rackLocation: 'Rack C-3',
    unit: 'Strip (15 tabs)',
    minStockAlert: 20,
    description: 'Hypertension and cardiovascular risk management'
  },
  {
    id: 'MED-107',
    name: 'Ascoril LS Syrup',
    genericName: 'Levosalbutamol + Ambroxol + Guaifenesin',
    category: 'Respiratory & Cough',
    dosage: 'Syrup (100ml)',
    manufacturer: 'Glenmark Pharmaceuticals',
    rackLocation: 'Rack D-1',
    unit: 'Bottle',
    minStockAlert: 10,
    description: 'Expectorant for productive wet cough with bronchospasm'
  },
  {
    id: 'MED-108',
    name: 'Becosules Z Capsules',
    genericName: 'B-Complex Forte with Vitamin C and Zinc',
    category: 'Vitamins & Supplements',
    dosage: 'Capsule',
    manufacturer: 'Pfizer Ltd',
    rackLocation: 'Rack D-3',
    unit: 'Strip (20 caps)',
    minStockAlert: 25,
    description: 'Daily nutritional supplement for vitality and immunity'
  },
  {
    id: 'MED-109',
    name: 'Azithral 500',
    genericName: 'Azithromycin 500mg',
    category: 'Antibiotics',
    dosage: 'Tablet',
    manufacturer: 'Alembic Pharmaceuticals',
    rackLocation: 'Rack A-4',
    unit: 'Strip (5 tabs)',
    minStockAlert: 15,
    description: 'Macrolide antibiotic for upper and lower respiratory infections'
  },
  {
    id: 'MED-110',
    name: 'Shelcal 500',
    genericName: 'Calcium Carbonate with Vitamin D3',
    category: 'Vitamins & Supplements',
    dosage: 'Tablet',
    manufacturer: 'Torrent Pharmaceuticals',
    rackLocation: 'Rack D-4',
    unit: 'Strip (15 tabs)',
    minStockAlert: 20,
    description: 'Bone density support and calcium deficiency management'
  }
];

// Batches include:
// 1. Valid fresh batches
// 2. Near-expiry batches (Dec 2026 - Jan 2027, <= 90 days from Nov 2026)
// 3. Expired batches (Oct 2026, Sept 2026) -> to demonstrate blocking sales!
// 4. Low stock batch
export const INITIAL_BATCHES = [
  {
    batchNumber: 'DL-24A1',
    medicineId: 'MED-101',
    medicineName: 'Dolo 650mg',
    quantity: 140,
    purchasePrice: 24.50,
    sellingPrice: 33.50,
    mfgDate: '2026-03-10',
    expiryDate: '2028-02-28',
    supplierId: 'SUP-001',
    supplierName: 'Apex Health Logistics'
  },
  {
    batchNumber: 'DL-23F9',
    medicineId: 'MED-101',
    medicineName: 'Dolo 650mg',
    quantity: 12, // Low stock & near expiry
    purchasePrice: 23.00,
    sellingPrice: 32.00,
    mfgDate: '2025-01-15',
    expiryDate: '2026-12-15', // Near expiry (~27 days left)
    supplierId: 'SUP-001',
    supplierName: 'Apex Health Logistics'
  },
  {
    batchNumber: 'AUG-88B',
    medicineId: 'MED-102',
    medicineName: 'Augmentin 625 Duo',
    quantity: 65,
    purchasePrice: 150.00,
    sellingPrice: 201.20,
    mfgDate: '2026-05-12',
    expiryDate: '2027-10-31',
    supplierId: 'SUP-003',
    supplierName: 'MedVantage Pharmaceuticals'
  },
  {
    batchNumber: 'AUG-71A',
    medicineId: 'MED-102',
    medicineName: 'Augmentin 625 Duo',
    quantity: 8, // EXPIRED batch
    purchasePrice: 145.00,
    sellingPrice: 195.00,
    mfgDate: '2024-11-01',
    expiryDate: '2026-10-25', // Already Expired!
    supplierId: 'SUP-003',
    supplierName: 'MedVantage Pharmaceuticals'
  },
  {
    batchNumber: 'PAN-55C',
    medicineId: 'MED-103',
    medicineName: 'Pan 40',
    quantity: 180,
    purchasePrice: 95.00,
    sellingPrice: 135.00,
    mfgDate: '2026-06-20',
    expiryDate: '2028-05-31',
    supplierId: 'SUP-002',
    supplierName: 'Sun BioCare Distributors'
  },
  {
    batchNumber: 'PAN-42K',
    medicineId: 'MED-103',
    medicineName: 'Pan 40',
    quantity: 18,
    purchasePrice: 90.00,
    sellingPrice: 130.00,
    mfgDate: '2025-02-10',
    expiryDate: '2027-01-15', // Near expiry (~58 days left)
    supplierId: 'SUP-002',
    supplierName: 'Sun BioCare Distributors'
  },
  {
    batchNumber: 'GLY-90X',
    medicineId: 'MED-104',
    medicineName: 'Glycomet 500 SR',
    quantity: 210,
    purchasePrice: 38.00,
    sellingPrice: 52.80,
    mfgDate: '2026-04-05',
    expiryDate: '2028-03-31',
    supplierId: 'SUP-004',
    supplierName: 'Zenith Chem & Labs'
  },
  {
    batchNumber: 'MNT-33P',
    medicineId: 'MED-105',
    medicineName: 'Montair LC',
    quantity: 90,
    purchasePrice: 165.00,
    sellingPrice: 220.00,
    mfgDate: '2026-07-15',
    expiryDate: '2028-06-30',
    supplierId: 'SUP-005',
    supplierName: 'CureWell Lifesciences'
  },
  {
    batchNumber: 'MNT-21M',
    medicineId: 'MED-105',
    medicineName: 'Montair LC',
    quantity: 6, // Low stock & near expiry
    purchasePrice: 160.00,
    sellingPrice: 215.00,
    mfgDate: '2025-01-10',
    expiryDate: '2027-01-05', // Near expiry (~48 days left)
    supplierId: 'SUP-005',
    supplierName: 'CureWell Lifesciences'
  },
  {
    batchNumber: 'TLM-12K',
    medicineId: 'MED-106',
    medicineName: 'Telma 40',
    quantity: 110,
    purchasePrice: 140.00,
    sellingPrice: 192.50,
    mfgDate: '2026-06-01',
    expiryDate: '2028-05-31',
    supplierId: 'SUP-001',
    supplierName: 'Apex Health Logistics'
  },
  {
    batchNumber: 'ASC-09L',
    medicineId: 'MED-107',
    medicineName: 'Ascoril LS Syrup',
    quantity: 45,
    purchasePrice: 82.00,
    sellingPrice: 118.00,
    mfgDate: '2026-08-01',
    expiryDate: '2028-07-31',
    supplierId: 'SUP-002',
    supplierName: 'Sun BioCare Distributors'
  },
  {
    batchNumber: 'ASC-04E',
    medicineId: 'MED-107',
    medicineName: 'Ascoril LS Syrup',
    quantity: 4, // EXPIRED batch
    purchasePrice: 78.00,
    sellingPrice: 112.00,
    mfgDate: '2024-10-10',
    expiryDate: '2026-09-30', // Already Expired!
    supplierId: 'SUP-002',
    supplierName: 'Sun BioCare Distributors'
  },
  {
    batchNumber: 'BCS-44W',
    medicineId: 'MED-108',
    medicineName: 'Becosules Z Capsules',
    quantity: 130,
    purchasePrice: 35.00,
    sellingPrice: 48.00,
    mfgDate: '2026-05-18',
    expiryDate: '2027-11-30',
    supplierId: 'SUP-003',
    supplierName: 'MedVantage Pharmaceuticals'
  },
  {
    batchNumber: 'AZT-22F',
    medicineId: 'MED-109',
    medicineName: 'Azithral 500',
    quantity: 50,
    purchasePrice: 92.00,
    sellingPrice: 125.00,
    mfgDate: '2026-04-10',
    expiryDate: '2027-12-31',
    supplierId: 'SUP-004',
    supplierName: 'Zenith Chem & Labs'
  },
  {
    batchNumber: 'SHL-81Q',
    medicineId: 'MED-110',
    medicineName: 'Shelcal 500',
    quantity: 85,
    purchasePrice: 88.00,
    sellingPrice: 122.50,
    mfgDate: '2026-06-15',
    expiryDate: '2028-05-31',
    supplierId: 'SUP-005',
    supplierName: 'CureWell Lifesciences'
  }
];

export const INITIAL_SALES = [
  {
    invoiceNumber: 'INV-2026-0042',
    date: '2026-11-18',
    time: '11:30 AM',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98112 34567',
    doctorName: 'Dr. S. K. Gupta',
    paymentMethod: 'UPI',
    items: [
      {
        medicineId: 'MED-101',
        medicineName: 'Dolo 650mg',
        batchNumber: 'DL-24A1',
        quantity: 2,
        unitPrice: 33.50,
        total: 67.00
      },
      {
        medicineId: 'MED-103',
        medicineName: 'Pan 40',
        batchNumber: 'PAN-55C',
        quantity: 1,
        unitPrice: 135.00,
        total: 135.00
      }
    ],
    subtotal: 202.00,
    discount: 10.00,
    tax: 0.00,
    grandTotal: 192.00
  },
  {
    invoiceNumber: 'INV-2026-0041',
    date: '2026-11-18',
    time: '10:15 AM',
    customerName: 'Priya Narang',
    customerPhone: '+91 99201 88776',
    doctorName: 'Dr. Anita Roy',
    paymentMethod: 'Cash',
    items: [
      {
        medicineId: 'MED-102',
        medicineName: 'Augmentin 625 Duo',
        batchNumber: 'AUG-88B',
        quantity: 1,
        unitPrice: 201.20,
        total: 201.20
      },
      {
        medicineId: 'MED-107',
        medicineName: 'Ascoril LS Syrup',
        batchNumber: 'ASC-09L',
        quantity: 1,
        unitPrice: 118.00,
        total: 118.00
      }
    ],
    subtotal: 319.20,
    discount: 19.20,
    tax: 0.00,
    grandTotal: 300.00
  },
  {
    invoiceNumber: 'INV-2026-0040',
    date: '2026-11-17',
    time: '04:45 PM',
    customerName: 'Kishore Aggarwal',
    customerPhone: '+91 97188 33441',
    doctorName: 'Dr. M. K. Jain',
    paymentMethod: 'Card',
    items: [
      {
        medicineId: 'MED-104',
        medicineName: 'Glycomet 500 SR',
        batchNumber: 'GLY-90X',
        quantity: 3,
        unitPrice: 52.80,
        total: 158.40
      },
      {
        medicineId: 'MED-106',
        medicineName: 'Telma 40',
        batchNumber: 'TLM-12K',
        quantity: 2,
        unitPrice: 192.50,
        total: 385.00
      }
    ],
    subtotal: 543.40,
    discount: 23.40,
    tax: 0.00,
    grandTotal: 520.00
  },
  {
    invoiceNumber: 'INV-2026-0039',
    date: '2026-11-17',
    time: '01:20 PM',
    customerName: 'Sunita Mehra',
    customerPhone: '+91 98990 12345',
    doctorName: 'Self',
    paymentMethod: 'Cash',
    items: [
      {
        medicineId: 'MED-108',
        medicineName: 'Becosules Z Capsules',
        batchNumber: 'BCS-44W',
        quantity: 2,
        unitPrice: 48.00,
        total: 96.00
      },
      {
        medicineId: 'MED-110',
        medicineName: 'Shelcal 500',
        batchNumber: 'SHL-81Q',
        quantity: 2,
        unitPrice: 122.50,
        total: 245.00
      }
    ],
    subtotal: 341.00,
    discount: 11.00,
    tax: 0.00,
    grandTotal: 330.00
  },
  {
    invoiceNumber: 'INV-2026-0038',
    date: '2026-11-16',
    time: '06:10 PM',
    customerName: 'Harish Chandra',
    customerPhone: '+91 98100 44556',
    doctorName: 'Dr. Roy',
    paymentMethod: 'UPI',
    items: [
      {
        medicineId: 'MED-105',
        medicineName: 'Montair LC',
        batchNumber: 'MNT-33P',
        quantity: 2,
        unitPrice: 220.00,
        total: 440.00
      }
    ],
    subtotal: 440.00,
    discount: 20.00,
    tax: 0.00,
    grandTotal: 420.00
  }
];

export const INITIAL_PURCHASES = [
  {
    purchaseId: 'PUR-2026-015',
    date: '2026-11-15',
    supplierId: 'SUP-001',
    supplierName: 'Apex Health Logistics',
    invoiceNumber: 'APX-99812',
    medicineId: 'MED-101',
    medicineName: 'Dolo 650mg',
    batchNumber: 'DL-24A1',
    quantity: 100,
    purchasePrice: 24.50,
    totalAmount: 2450.00,
    expiryDate: '2028-02-28',
    status: 'Received'
  },
  {
    purchaseId: 'PUR-2026-014',
    date: '2026-11-12',
    supplierId: 'SUP-002',
    supplierName: 'Sun BioCare Distributors',
    invoiceNumber: 'SBC-4120',
    medicineId: 'MED-103',
    medicineName: 'Pan 40',
    batchNumber: 'PAN-55C',
    quantity: 150,
    purchasePrice: 95.00,
    totalAmount: 14250.00,
    expiryDate: '2028-05-31',
    status: 'Received'
  },
  {
    purchaseId: 'PUR-2026-013',
    date: '2026-11-10',
    supplierId: 'SUP-003',
    supplierName: 'MedVantage Pharmaceuticals',
    invoiceNumber: 'MV-7741',
    medicineId: 'MED-102',
    medicineName: 'Augmentin 625 Duo',
    batchNumber: 'AUG-88B',
    quantity: 50,
    purchasePrice: 150.00,
    totalAmount: 7500.00,
    expiryDate: '2027-10-31',
    status: 'Received'
  },
  {
    purchaseId: 'PUR-2026-012',
    date: '2026-11-05',
    supplierId: 'SUP-004',
    supplierName: 'Zenith Chem & Labs',
    invoiceNumber: 'ZCL-1049',
    medicineId: 'MED-104',
    medicineName: 'Glycomet 500 SR',
    batchNumber: 'GLY-90X',
    quantity: 200,
    purchasePrice: 38.00,
    totalAmount: 7600.00,
    expiryDate: '2028-03-31',
    status: 'Received'
  }
];

-- إنشاء جداول قاعدة البيانات لنظام إدارة عيادة الأسنان

-- جدول المستخدمين (الأطباء، الموظفين، المسؤولين)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL, -- 'admin', 'doctor', 'receptionist', 'assistant'
    specialty TEXT, -- للأطباء فقط
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول الفروع
CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    manager_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- جدول المرضى
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    emergency_contact TEXT,
    blood_type TEXT,
    allergies TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول المواعيد
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL, -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
    type TEXT NOT NULL, -- 'checkup', 'treatment', 'follow_up', 'emergency'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- جدول العلاجات
CREATE TABLE IF NOT EXISTS treatments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'cleaning', 'filling', 'extraction', 'root_canal', 'crown', 'implant', etc.
    default_price REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول سجلات العلاج
CREATE TABLE IF NOT EXISTS treatment_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    treatment_id INTEGER NOT NULL,
    tooth_number TEXT, -- رقم السن المعالج
    notes TEXT,
    status TEXT NOT NULL, -- 'planned', 'in_progress', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

-- جدول الفواتير
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER,
    total_amount REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    final_amount REAL NOT NULL,
    status TEXT NOT NULL, -- 'draft', 'issued', 'paid', 'partially_paid', 'cancelled'
    payment_method TEXT, -- 'cash', 'credit_card', 'insurance', 'bank_transfer'
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- جدول عناصر الفاتورة
CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    treatment_record_id INTEGER,
    treatment_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price REAL NOT NULL,
    discount_percentage REAL DEFAULT 0,
    amount REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (treatment_record_id) REFERENCES treatment_records(id),
    FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

-- جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL, -- 'cash', 'credit_card', 'insurance', 'bank_transfer'
    payment_date DATE NOT NULL,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- جدول شركات التأمين
CREATE TABLE IF NOT EXISTS insurance_companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    coverage_percentage REAL DEFAULT 80,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول بوالص التأمين للمرضى
CREATE TABLE IF NOT EXISTS patient_insurance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    insurance_company_id INTEGER NOT NULL,
    policy_number TEXT NOT NULL,
    coverage_percentage REAL NOT NULL,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (insurance_company_id) REFERENCES insurance_companies(id)
);

-- جدول المخزون
CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'material', 'tool', 'medicine', 'equipment'
    description TEXT,
    unit TEXT NOT NULL, -- 'piece', 'box', 'kg', 'liter'
    current_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_quantity INTEGER NOT NULL DEFAULT 10,
    cost_price REAL,
    supplier_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول الموردين
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- جدول حركات المخزون
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL, -- 'purchase', 'consumption', 'adjustment', 'return'
    quantity INTEGER NOT NULL,
    unit_price REAL,
    total_price REAL,
    reference_number TEXT,
    notes TEXT,
    transaction_date DATE NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    patient_id INTEGER,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'appointment_reminder', 'payment_due', 'inventory_alert', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- جدول تقييمات المرضى
CREATE TABLE IF NOT EXISTS patient_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER,
    rating INTEGER NOT NULL, -- 1-5
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- جدول نقاط المكافآت
CREATE TABLE IF NOT EXISTS reward_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL, -- 'earned', 'redeemed'
    reference_id INTEGER, -- يمكن أن يكون معرف الفاتورة أو المعاملة
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- إنشاء مستخدم افتراضي للنظام (مسؤول)
INSERT INTO users (username, password, full_name, email, role)
VALUES ('admin', '$2a$12$1234567890123456789012uGZACxF5WBI6N9AO22lzQq0kQEi51Fm', 'مدير النظام', 'admin@dentalclinic.com', 'admin');

-- إنشاء فرع افتراضي
INSERT INTO branches (name, address, phone, manager_id)
VALUES ('الفرع الرئيسي', 'شارع الرئيسي، المدينة', '+9661234567', 1);

-- إضافة بعض العلاجات الافتراضية
INSERT INTO treatments (name, description, category, default_price, duration_minutes)
VALUES 
('فحص أسنان', 'فحص روتيني للأسنان', 'checkup', 50, 30),
('تنظيف الأسنان', 'إزالة الجير وتلميع الأسنان', 'cleaning', 100, 45),
('حشو أسنان', 'حشو تجويف الأسنان', 'filling', 150, 60),
('علاج عصب', 'علاج قناة الجذر', 'root_canal', 500, 90),
('خلع سن', 'إزالة السن', 'extraction', 200, 45),
('تركيب تاج', 'تركيب تاج سني', 'crown', 800, 60),
('زراعة أسنان', 'زراعة سن صناعي', 'implant', 2000, 120);

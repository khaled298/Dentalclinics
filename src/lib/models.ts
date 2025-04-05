// نماذج البيانات الأساسية لنظام إدارة عيادة الأسنان

// نموذج المستخدم
export interface User {
  id?: number;
  username: string;
  password?: string; // لا يتم إرجاعه في الاستعلامات
  full_name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'assistant';
  specialty?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// نموذج الفرع
export interface Branch {
  id?: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager_id?: number;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// نموذج المريض
export interface Patient {
  id?: number;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  phone: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// نموذج الموعد
export interface Appointment {
  id?: number;
  patient_id: number;
  doctor_id: number;
  branch_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'checkup' | 'treatment' | 'follow_up' | 'emergency';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // علاقات
  patient?: Patient;
  doctor?: User;
  branch?: Branch;
}

// نموذج العلاج
export interface Treatment {
  id?: number;
  name: string;
  description?: string;
  category: string;
  default_price: number;
  duration_minutes: number;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// نموذج سجل العلاج
export interface TreatmentRecord {
  id?: number;
  patient_id: number;
  appointment_id: number;
  doctor_id: number;
  treatment_id: number;
  tooth_number?: string;
  notes?: string;
  status: 'planned' | 'in_progress' | 'completed';
  created_at?: string;
  updated_at?: string;
  
  // علاقات
  patient?: Patient;
  appointment?: Appointment;
  doctor?: User;
  treatment?: Treatment;
}

// نموذج الفاتورة
export interface Invoice {
  id?: number;
  patient_id: number;
  appointment_id?: number;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  final_amount: number;
  status: 'draft' | 'issued' | 'paid' | 'partially_paid' | 'cancelled';
  payment_method?: 'cash' | 'credit_card' | 'insurance' | 'bank_transfer';
  issue_date: string;
  due_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // علاقات
  patient?: Patient;
  appointment?: Appointment;
  invoice_items?: InvoiceItem[];
  payments?: Payment[];
}

// نموذج عنصر الفاتورة
export interface InvoiceItem {
  id?: number;
  invoice_id: number;
  treatment_record_id?: number;
  treatment_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  amount: number;
  created_at?: string;
  updated_at?: string;
  
  // علاقات
  invoice?: Invoice;
  treatment_record?: TreatmentRecord;
  treatment?: Treatment;
}

// نموذج الدفع
export interface Payment {
  id?: number;
  invoice_id: number;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'insurance' | 'bank_transfer';
  payment_date: string;
  reference_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // علاقات
  invoice?: Invoice;
}

// نموذج شركة التأمين
export interface InsuranceCompany {
  id?: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  coverage_percentage: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// نموذج بوليصة التأمين للمريض
export interface PatientInsurance {
  id?: number;
  patient_id: number;
  insurance_company_id: number;
  policy_number: string;
  coverage_percentage: number;
  expiry_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
  
  // علاقات
  patient?: Patient;
  insurance_company?: InsuranceCompany;
}

// نموذج عنصر المخزون
export interface InventoryItem {
  id?: number;
  name: string;
  category: 'material' | 'tool' | 'medicine' | 'equipment';
  description?: string;
  unit: string;
  current_quantity: number;
  minimum_quantity: number;
  cost_price?: number;
  supplier_id?: number;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
  
  // علاقات
  supplier?: Supplier;
}

// نموذج المورد
export interface Supplier {
  id?: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// نموذج حركة المخزون
export interface InventoryTransaction {
  id?: number;
  item_id: number;
  transaction_type: 'purchase' | 'consumption' | 'adjustment' | 'return';
  quantity: number;
  unit_price?: number;
  total_price?: number;
  reference_number?: string;
  notes?: string;
  transaction_date: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  
  // علاقات
  item?: InventoryItem;
  user?: User;
}

// نموذج الإشعار
export interface Notification {
  id?: number;
  user_id?: number;
  patient_id?: number;
  title: string;
  message: string;
  type: 'appointment_reminder' | 'payment_due' | 'inventory_alert' | 'system';
  is_read: boolean;
  created_at?: string;
  
  // علاقات
  user?: User;
  patient?: Patient;
}

// نموذج تقييم المريض
export interface PatientFeedback {
  id?: number;
  patient_id: number;
  appointment_id?: number;
  rating: number; // 1-5
  comments?: string;
  created_at?: string;
  
  // علاقات
  patient?: Patient;
  appointment?: Appointment;
}

// نموذج نقاط المكافآت
export interface RewardPoint {
  id?: number;
  patient_id: number;
  points: number;
  transaction_type: 'earned' | 'redeemed';
  reference_id?: number;
  notes?: string;
  created_at?: string;
  
  // علاقات
  patient?: Patient;
}

'use client';

import React, { useState } from 'react';
import { Navbar, Card, Button, Table, Input, Select, Alert, Spinner } from '../../components/ui';

export default function PatientsPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  
  // بيانات وهمية للمرضى
  const patients = [
    { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com', lastVisit: '2023-09-15', status: 'نشط' },
    { id: 2, name: 'سارة أحمد', phone: '0551234567', email: 'sara@example.com', lastVisit: '2023-09-10', status: 'نشط' },
    { id: 3, name: 'محمد علي', phone: '0561234567', email: 'mohamed@example.com', lastVisit: '2023-08-25', status: 'نشط' },
    { id: 4, name: 'فاطمة حسن', phone: '0521234567', email: 'fatima@example.com', lastVisit: '2023-08-20', status: 'نشط' },
    { id: 5, name: 'خالد عبدالله', phone: '0531234567', email: 'khaled@example.com', lastVisit: '2023-07-15', status: 'غير نشط' },
  ];

  // أعمدة جدول المرضى
  const patientColumns = [
    { header: 'الاسم', accessor: 'name' },
    { header: 'رقم الهاتف', accessor: 'phone' },
    { header: 'البريد الإلكتروني', accessor: 'email' },
    { header: 'آخر زيارة', accessor: 'lastVisit' },
    { header: 'الحالة', accessor: 'status' },
    { 
      header: 'الإجراءات', 
      cell: (row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="ml-2">عرض</Button>
          <Button variant="primary" size="sm" className="ml-2">تعديل</Button>
          <Button variant="danger" size="sm">حذف</Button>
        </div>
      ) 
    },
  ];

  // روابط القائمة الرئيسية
  const navLinks = [
    { label: 'لوحة التحكم', href: '/dashboard' },
    { label: 'المرضى', href: '/patients' },
    { label: 'المواعيد', href: '/appointments' },
    { label: 'العلاجات', href: '/treatments' },
    { label: 'الفواتير', href: '/invoices' },
    { label: 'المخزون', href: '/inventory' },
  ];

  // روابط قائمة المستخدم
  const userMenuLinks = [
    { label: 'الملف الشخصي', href: '/profile' },
    { label: 'الإعدادات', href: '/settings' },
    { label: 'تسجيل الخروج', href: '/logout' },
  ];

  // نموذج إضافة مريض جديد
  const AddPatientForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      gender: 'ذكر',
      address: '',
      medicalHistory: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      console.log('بيانات المريض الجديد:', formData);
      setShowAddPatient(false);
    };

    return (
      <Card title="إضافة مريض جديد" className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="الاسم الكامل"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="رقم الهاتف"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="البريد الإلكتروني"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="تاريخ الميلاد"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <Select
              label="الجنس"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'ذكر', label: 'ذكر' },
                { value: 'أنثى', label: 'أنثى' },
              ]}
            />
            <Input
              label="العنوان"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
              التاريخ الطبي
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows={3}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              value={formData.medicalHistory}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowAddPatient(false)} className="ml-3">
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              حفظ
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  // تصفية المرضى بناءً على مصطلح البحث
  const filteredPatients = patients.filter(patient => 
    patient.name.includes(searchTerm) || 
    patient.phone.includes(searchTerm) || 
    patient.email.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        logo={<div className="text-xl font-bold text-blue-600">عيادة الأسنان</div>}
        links={navLinks}
        userMenu={userMenuLinks}
      />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">إدارة المرضى</h1>
          <Button variant="primary" onClick={() => setShowAddPatient(true)}>
            إضافة مريض جديد
          </Button>
        </div>
        
        {showAddPatient && <AddPatientForm />}
        
        <Card className="mb-6">
          <div className="mb-4">
            <Input
              label="بحث عن مريض"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو رقم الهاتف أو البريد الإلكتروني..."
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table columns={patientColumns} data={filteredPatients} />
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              إجمالي المرضى: {patients.length}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="ml-2">السابق</Button>
              <Button variant="outline" size="sm">التالي</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

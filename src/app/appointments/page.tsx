'use client';

import React, { useState } from 'react';
import { Navbar, Card, Button, Table, Input, Select, Alert, Spinner } from '../../components/ui';

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // بيانات وهمية للمواعيد
  const appointments = [
    { id: 1, patientName: 'أحمد محمد', doctorName: 'د. سمير علي', date: '2023-09-20', startTime: '09:00', endTime: '09:30', type: 'فحص', status: 'مؤكد' },
    { id: 2, patientName: 'سارة أحمد', doctorName: 'د. ليلى حسن', date: '2023-09-20', startTime: '10:30', endTime: '11:15', type: 'علاج', status: 'مؤكد' },
    { id: 3, patientName: 'محمد علي', doctorName: 'د. سمير علي', date: '2023-09-20', startTime: '11:45', endTime: '12:15', type: 'متابعة', status: 'قيد الانتظار' },
    { id: 4, patientName: 'فاطمة حسن', doctorName: 'د. خالد محمود', date: '2023-09-20', startTime: '13:15', endTime: '14:00', type: 'طوارئ', status: 'مؤكد' },
    { id: 5, patientName: 'خالد عبدالله', doctorName: 'د. ليلى حسن', date: '2023-09-20', startTime: '14:30', endTime: '15:15', type: 'علاج', status: 'مؤكد' },
  ];

  // أعمدة جدول المواعيد
  const appointmentColumns = [
    { header: 'الوقت', cell: (row) => `${row.startTime} - ${row.endTime}` },
    { header: 'اسم المريض', accessor: 'patientName' },
    { header: 'الطبيب', accessor: 'doctorName' },
    { header: 'نوع الموعد', accessor: 'type' },
    { header: 'الحالة', accessor: 'status' },
    { 
      header: 'الإجراءات', 
      cell: (row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="ml-2">عرض</Button>
          <Button variant="primary" size="sm" className="ml-2">تعديل</Button>
          <Button variant="danger" size="sm">إلغاء</Button>
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

  // بيانات وهمية للأطباء
  const doctors = [
    { id: 1, name: 'د. سمير علي', specialty: 'طب أسنان عام' },
    { id: 2, name: 'د. ليلى حسن', specialty: 'تقويم الأسنان' },
    { id: 3, name: 'د. خالد محمود', specialty: 'جراحة الفم والأسنان' },
  ];

  // نموذج إضافة موعد جديد
  const AddAppointmentForm = () => {
    const [formData, setFormData] = useState({
      patientId: '',
      doctorId: '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      type: 'فحص',
      notes: '',
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
      console.log('بيانات الموعد الجديد:', formData);
      setShowAddAppointment(false);
    };

    return (
      <Card title="إضافة موعد جديد" className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="المريض"
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              options={[
                { value: '', label: 'اختر المريض' },
                { value: '1', label: 'أحمد محمد' },
                { value: '2', label: 'سارة أحمد' },
                { value: '3', label: 'محمد علي' },
                { value: '4', label: 'فاطمة حسن' },
                { value: '5', label: 'خالد عبدالله' },
              ]}
            />
            <Select
              label="الطبيب"
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              options={[
                { value: '', label: 'اختر الطبيب' },
                ...doctors.map(doctor => ({ value: doctor.id.toString(), label: doctor.name }))
              ]}
            />
            <Input
              label="التاريخ"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="وقت البدء"
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <Input
                label="وقت الانتهاء"
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <Select
              label="نوع الموعد"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              options={[
                { value: 'فحص', label: 'فحص' },
                { value: 'علاج', label: 'علاج' },
                { value: 'متابعة', label: 'متابعة' },
                { value: 'طوارئ', label: 'طوارئ' },
              ]}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowAddAppointment(false)} className="ml-3">
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

  // تصفية المواعيد بناءً على مصطلح البحث والتاريخ المحدد
  const filteredAppointments = appointments.filter(appointment => 
    (appointment.patientName.includes(searchTerm) || 
     appointment.doctorName.includes(searchTerm)) &&
    appointment.date === selectedDate
  );

  // عرض جدول المواعيد حسب الوقت
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const appointmentsAtTime = filteredAppointments.filter(a => a.startTime === timeString);
      
      timeSlots.push({
        time: timeString,
        appointments: appointmentsAtTime,
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        logo={<div className="text-xl font-bold text-blue-600">عيادة الأسنان</div>}
        links={navLinks}
        userMenu={userMenuLinks}
      />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">إدارة المواعيد</h1>
          <Button variant="primary" onClick={() => setShowAddAppointment(true)}>
            إضافة موعد جديد
          </Button>
        </div>
        
        {showAddAppointment && <AddAppointmentForm />}
        
        <Card className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
            <Input
              label="بحث عن موعد"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم المريض أو الطبيب..."
            />
            <Input
              label="التاريخ"
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Select
              label="الطبيب"
              id="doctorFilter"
              options={[
                { value: '', label: 'جميع الأطباء' },
                ...doctors.map(doctor => ({ value: doctor.id.toString(), label: doctor.name }))
              ]}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {timeSlots.map((slot, index) => (
                  <li key={index} className={slot.appointments.length > 0 ? 'bg-blue-50' : ''}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{slot.time}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            {slot.appointments.length === 0 ? (
                              <p className="text-sm text-gray-500">لا توجد مواعيد</p>
                            ) : (
                              <div className="space-y-2">
                                {slot.appointments.map(appointment => (
                                  <div key={appointment.id} className="flex justify-between bg-white p-2 rounded-md shadow-sm">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                                      <p className="text-xs text-gray-500">{appointment.doctorName} - {appointment.type}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm" className="ml-2">عرض</Button>
                                      <Button variant="danger" size="sm">إلغاء</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              إجمالي المواعيد: {filteredAppointments.length}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

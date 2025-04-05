'use client';

import React, { useState } from 'react';
import { Navbar, Card, Button, Table, Spinner } from '../../components/ui';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  
  // بيانات وهمية للمواعيد اليوم
  const todayAppointments = [
    { id: 1, patientName: 'أحمد محمد', time: '09:00', type: 'فحص', status: 'مؤكد' },
    { id: 2, patientName: 'سارة أحمد', time: '10:30', type: 'علاج', status: 'مؤكد' },
    { id: 3, patientName: 'محمد علي', time: '11:45', type: 'متابعة', status: 'قيد الانتظار' },
    { id: 4, patientName: 'فاطمة حسن', time: '13:15', type: 'طوارئ', status: 'مؤكد' },
    { id: 5, patientName: 'خالد عبدالله', time: '14:30', type: 'علاج', status: 'مؤكد' },
  ];

  // أعمدة جدول المواعيد
  const appointmentColumns = [
    { header: 'الوقت', accessor: 'time' },
    { header: 'اسم المريض', accessor: 'patientName' },
    { header: 'نوع الموعد', accessor: 'type' },
    { header: 'الحالة', accessor: 'status' },
    { 
      header: 'الإجراءات', 
      cell: (row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="ml-2">عرض</Button>
          <Button variant="success" size="sm">تأكيد</Button>
        </div>
      ) 
    },
  ];

  // بيانات وهمية للإحصائيات
  const stats = [
    { title: 'المواعيد اليوم', value: '12' },
    { title: 'المرضى الجدد هذا الأسبوع', value: '8' },
    { title: 'إجمالي المرضى', value: '342' },
    { title: 'الفواتير غير المدفوعة', value: '5' },
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        logo={<div className="text-xl font-bold text-blue-600">عيادة الأسنان</div>}
        links={navLinks}
        userMenu={userMenuLinks}
      />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">لوحة التحكم</h1>
        
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white overflow-hidden shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="mr-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* مواعيد اليوم */}
        <Card title="مواعيد اليوم" className="mb-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table columns={appointmentColumns} data={todayAppointments} />
          )}
          <div className="mt-4 flex justify-end">
            <Button variant="primary">عرض جميع المواعيد</Button>
          </div>
        </Card>
        
        {/* الإجراءات السريعة */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="إجراءات سريعة" className="mb-6">
            <div className="space-y-3">
              <Button variant="primary" className="w-full">إضافة موعد جديد</Button>
              <Button variant="outline" className="w-full">تسجيل مريض جديد</Button>
              <Button variant="outline" className="w-full">إنشاء فاتورة جديدة</Button>
              <Button variant="outline" className="w-full">تقرير المواعيد الأسبوعي</Button>
            </div>
          </Card>
          
          <Card title="التذكيرات" className="mb-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      طلب مستلزمات طبية
                    </p>
                    <p className="text-sm text-gray-500">
                      مخزون الحشوات منخفض
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">إجراء</Button>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      فواتير مستحقة
                    </p>
                    <p className="text-sm text-gray-500">
                      5 فواتير تحتاج إلى متابعة
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">عرض</Button>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      صيانة المعدات
                    </p>
                    <p className="text-sm text-gray-500">
                      موعد الصيانة الدورية للأجهزة
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">جدولة</Button>
                  </div>
                </div>
              </li>
            </ul>
          </Card>
          
          <Card title="آخر التحديثات" className="mb-6">
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 right-4 -mr-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">تم تسجيل مريض جديد <span className="font-medium text-gray-900">سارة أحمد</span></p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2023-09-20">منذ 20 دقيقة</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 right-4 -mr-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">تم إكمال علاج <span className="font-medium text-gray-900">محمد علي</span></p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2023-09-20">منذ ساعة</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">تم إصدار فاتورة جديدة بقيمة <span className="font-medium text-gray-900">500 ريال</span></p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2023-09-20">منذ 3 ساعات</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

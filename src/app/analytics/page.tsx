'use client';

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Navbar, Card, Button, Spinner } from '../../components/ui';

export default function DashboardPage() {
  const { 
    loading, 
    error, 
    getAppointmentAnalytics, 
    getRevenueAnalytics, 
    getDoctorPerformance, 
    getPatientAnalytics,
    getClinicPerformanceReport
  } = useAnalytics();
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const [dashboardData, setDashboardData] = useState({
    appointmentAnalytics: null,
    revenueAnalytics: null,
    doctorPerformance: null,
    patientAnalytics: null,
    performanceReport: null
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          appointmentData,
          revenueData,
          doctorData,
          patientData,
          performanceData
        ] = await Promise.all([
          getAppointmentAnalytics(dateRange.startDate, dateRange.endDate),
          getRevenueAnalytics(dateRange.startDate, dateRange.endDate),
          getDoctorPerformance(dateRange.startDate, dateRange.endDate),
          getPatientAnalytics(dateRange.startDate, dateRange.endDate),
          getClinicPerformanceReport(dateRange.startDate, dateRange.endDate)
        ]);
        
        setDashboardData({
          appointmentAnalytics: appointmentData,
          revenueAnalytics: revenueData,
          doctorPerformance: doctorData,
          patientAnalytics: patientData,
          performanceReport: performanceData
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    fetchDashboardData();
  }, [dateRange]);
  
  // روابط القائمة الرئيسية
  const navLinks = [
    { label: 'لوحة التحكم', href: '/dashboard' },
    { label: 'المرضى', href: '/patients' },
    { label: 'المواعيد', href: '/appointments' },
    { label: 'العلاجات', href: '/treatments' },
    { label: 'الفواتير', href: '/invoices' },
    { label: 'المخزون', href: '/inventory' },
    { label: 'التقارير', href: '/reports' }
  ];

  // روابط قائمة المستخدم
  const userMenuLinks = [
    { label: 'الملف الشخصي', href: '/profile' },
    { label: 'الإعدادات', href: '/settings' },
    { label: 'تسجيل الخروج', href: '/logout' },
  ];
  
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
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
          <h1 className="text-2xl font-semibold text-gray-900">لوحة التحليلات</h1>
          <div className="flex space-x-4">
            <div className="ml-4">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                من تاريخ
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                إلى تاريخ
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* ملخص الأداء */}
        {dashboardData.performanceReport && (
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2">إجمالي الإيرادات</h3>
                <p className="text-3xl font-bold">{dashboardData.performanceReport.summary.totalRevenue} ريال</p>
                <p className="text-sm mt-2">
                  {dashboardData.performanceReport.keyMetrics.revenueGrowth > 0 ? '+' : ''}
                  {dashboardData.performanceReport.keyMetrics.revenueGrowth}% من الفترة السابقة
                </p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2">إجمالي المواعيد</h3>
                <p className="text-3xl font-bold">{dashboardData.performanceReport.summary.totalAppointments}</p>
                <p className="text-sm mt-2">
                  نسبة الإكمال: {dashboardData.performanceReport.summary.completionRate.toFixed(1)}%
                </p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2">المرضى الجدد</h3>
                <p className="text-3xl font-bold">{dashboardData.performanceReport.summary.newPatients}</p>
                <p className="text-sm mt-2">
                  {dashboardData.performanceReport.keyMetrics.patientGrowth > 0 ? '+' : ''}
                  {dashboardData.performanceReport.keyMetrics.patientGrowth}% من الفترة السابقة
                </p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2">رضا المرضى</h3>
                <p className="text-3xl font-bold">{dashboardData.performanceReport.summary.averagePatientSatisfaction}/5</p>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(dashboardData.performanceReport.summary.averagePatientSatisfaction) ? 'text-yellow-300' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* تحليلات المواعيد */}
        {dashboardData.appointmentAnalytics && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">تحليلات المواعيد</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">توزيع المواعيد حسب اليوم</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {Object.entries(dashboardData.appointmentAnalytics.appointmentsByDay).map(([day, count]) => (
                    <div key={day} className="flex items-center mb-2">
                      <span className="w-20 text-sm text-gray-600">{day}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(dashboardData.appointmentAnalytics.appointmentsByDay))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-sm text-gray-600 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">توزيع المواعيد حسب النوع</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {Object.entries(dashboardData.appointmentAnalytics.appointmentsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center mb-2">
                      <span className="w-20 text-sm text-gray-600">{type}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(dashboardData.appointmentAnalytics.appointmentsByType))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-sm text-gray-600 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">إجمالي المواعيد</h4>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.appointmentAnalytics.totalAppointments}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">المواعيد المكتملة</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData.appointmentAnalytics.completedAppointments}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">المواعيد الملغاة</h4>
                <p className="text-2xl font-bold text-red-600">{dashboardData.appointmentAnalytics.cancelledAppointments}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* تحليلات الإيرادات */}
        {dashboardData.revenueAnalytics && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">تحليلات الإيرادات</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">الإيرادات حسب الشهر</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {Object.entries(dashboardData.revenueAnalytics.revenueByMonth).map(([month, revenue]) => (
                    <div key={month} className="flex items-center mb-2">
                      <span className="w-20 text-sm text-gray-600">{month}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(revenue / Math.max(...Object.values(dashboardData.revenueAnalytics.revenueByMonth))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-24 text-sm text-gray-600 text-right">{revenue} ريال</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">الإيرادات حسب الخدمة</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {Object.entries(dashboardData.revenueAnalytics.revenueByService).slice(0, 5).map(([service, revenue]) => (
                    <div key={service} className="flex items-center mb-2">
                      <span className="w-32 text-sm text-gray-600">{service}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(revenue / Math.max(...Object.values(dashboardData.revenueAnalytics.revenueByService))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-24 text-sm text-gray-600 text-right">{revenue} ريال</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">إجمالي الإيرادات</h4>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.revenueAnalytics.totalRevenue} ريال</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">المبالغ المدفوعة</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData.revenueAnalytics.paidAmount} ريال</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">المبالغ المستحقة</h4>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.revenueAnalytics.pendingAmount} ريال</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* أداء الأطباء */}
        {dashboardData.doctorPerformance && Array.isArray(dashboardData.doctorPerformance) && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">أداء الأطباء</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطبيب
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المواعيد
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإيرادات
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رضا المرضى
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخدمة الأكثر تقديماً
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.doctorPerformance.map((doctor) => (
                    <tr key={doctor.doctorId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.doctorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.completedAppointments} / {doctor.totalAppointments}</div>
                        <div className="text-xs text-gray-500">
                          {((doctor.completedAppointments / doctor.totalAppointments) * 100).toFixed(1)}% إكمال
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.totalRevenue} ريال</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 ml-1">{doctor.patientSatisfaction}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${star <= Math.round(doctor.patientSatisfaction) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {doctor.servicesPerformed[0]?.name} ({doctor.servicesPerformed[0]?.count})
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        
        {/* تحليلات المرضى */}
        {dashboardData.patientAnalytics && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">تحليلات المرضى</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">توزيع المرضى حسب العمر</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {Object.entries(dashboardData.patientAnalytics.patientsByAge).map(([ageGroup, count]) => (
                    <div key={ageGroup} className="flex items-center mb-2">
                      <span className="w-16 text-sm text-gray-600">{ageGroup}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(dashboardData.patientAnalytics.patientsByAge))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-sm text-gray-600 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">توزيع المرضى حسب الجنس</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {Object.entries(dashboardData.patientAnalytics.patientsByGender).map(([gender, count]) => (
                    <div key={gender} className="flex items-center mb-2">
                      <span className="w-16 text-sm text-gray-600">{gender}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${gender === 'ذكر' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full`}
                          style={{ width: `${(count / Math.max(...Object.values(dashboardData.patientAnalytics.patientsByGender))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-sm text-gray-600 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">إجمالي المرضى</h4>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.patientAnalytics.totalPatients}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">المرضى الجدد</h4>
                <p className="text-2xl font-bold text-green-600">{dashboardData.patientAnalytics.newPatients}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">معدل الاحتفاظ</h4>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.patientAnalytics.patientRetentionRate}%</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <h4 className="text-sm font-medium text-gray-500 mb-1">متوسط الزيارات</h4>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.patientAnalytics.averageVisitsPerPatient}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* التوصيات */}
        {dashboardData.performanceReport && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">التوصيات</h2>
            <ul className="space-y-2">
              {dashboardData.performanceReport.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => window.location.href = '/reports'}>
            عرض جميع التقارير
          </Button>
        </div>
      </div>
    </div>
  );
}

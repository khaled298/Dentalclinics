'use client';

import { useState, useEffect } from 'react';
import { AppointmentAnalytics, RevenueAnalytics, DoctorPerformance, PatientAnalytics } from '../../lib/models';

// مدير حالة التقارير والتحليلات
export function useAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // تحليلات المواعيد
  const getAppointmentAnalytics = async (startDate: string, endDate: string, doctorId?: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // هنا نستخدم بيانات وهمية للتوضيح
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAppointmentAnalytics: AppointmentAnalytics = {
        totalAppointments: 120,
        completedAppointments: 95,
        cancelledAppointments: 15,
        noShowAppointments: 10,
        appointmentsByDay: {
          'الأحد': 15,
          'الاثنين': 22,
          'الثلاثاء': 25,
          'الأربعاء': 20,
          'الخميس': 18,
          'الجمعة': 10,
          'السبت': 10
        },
        appointmentsByType: {
          'فحص': 40,
          'علاج': 50,
          'متابعة': 20,
          'طوارئ': 10
        },
        averageAppointmentDuration: 45, // بالدقائق
        busyHours: ['10:00', '11:00', '14:00', '15:00'],
        quietHours: ['08:00', '09:00', '16:00', '17:00']
      };
      
      setError(null);
      return mockAppointmentAnalytics;
    } catch (err) {
      console.error('Error fetching appointment analytics:', err);
      setError('حدث خطأ أثناء جلب تحليلات المواعيد');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // تحليلات الإيرادات
  const getRevenueAnalytics = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRevenueAnalytics: RevenueAnalytics = {
        totalRevenue: 75000,
        paidAmount: 65000,
        pendingAmount: 10000,
        revenueByMonth: {
          'يناير': 12000,
          'فبراير': 15000,
          'مارس': 18000,
          'أبريل': 20000,
          'مايو': 10000
        },
        revenueByService: {
          'فحص أسنان': 5000,
          'تنظيف الأسنان': 10000,
          'حشو أسنان': 15000,
          'علاج عصب': 25000,
          'خلع سن': 5000,
          'تركيب تاج': 10000,
          'زراعة أسنان': 5000
        },
        revenueByPaymentMethod: {
          'نقدي': 30000,
          'بطاقة ائتمان': 25000,
          'تأمين': 15000,
          'تحويل بنكي': 5000
        },
        averageRevenuePerPatient: 625,
        topServices: [
          { name: 'علاج عصب', revenue: 25000 },
          { name: 'حشو أسنان', revenue: 15000 },
          { name: 'تنظيف الأسنان', revenue: 10000 }
        ]
      };
      
      setError(null);
      return mockRevenueAnalytics;
    } catch (err) {
      console.error('Error fetching revenue analytics:', err);
      setError('حدث خطأ أثناء جلب تحليلات الإيرادات');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // تحليلات أداء الأطباء
  const getDoctorPerformance = async (startDate: string, endDate: string, doctorId?: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDoctorPerformance: DoctorPerformance[] = [
        {
          doctorId: 1,
          doctorName: 'د. سمير علي',
          totalAppointments: 50,
          completedAppointments: 45,
          cancelledAppointments: 3,
          noShowAppointments: 2,
          totalRevenue: 30000,
          patientSatisfaction: 4.8,
          averageAppointmentDuration: 40,
          servicesPerformed: [
            { name: 'فحص أسنان', count: 20 },
            { name: 'حشو أسنان', count: 15 },
            { name: 'علاج عصب', count: 10 }
          ]
        },
        {
          doctorId: 2,
          doctorName: 'د. ليلى حسن',
          totalAppointments: 40,
          completedAppointments: 35,
          cancelledAppointments: 4,
          noShowAppointments: 1,
          totalRevenue: 25000,
          patientSatisfaction: 4.6,
          averageAppointmentDuration: 50,
          servicesPerformed: [
            { name: 'تقويم الأسنان', count: 20 },
            { name: 'فحص أسنان', count: 15 },
            { name: 'تنظيف الأسنان', count: 5 }
          ]
        },
        {
          doctorId: 3,
          doctorName: 'د. خالد محمود',
          totalAppointments: 30,
          completedAppointments: 25,
          cancelledAppointments: 3,
          noShowAppointments: 2,
          totalRevenue: 20000,
          patientSatisfaction: 4.7,
          averageAppointmentDuration: 45,
          servicesPerformed: [
            { name: 'جراحة الفم', count: 10 },
            { name: 'خلع سن', count: 15 },
            { name: 'فحص أسنان', count: 5 }
          ]
        }
      ];
      
      // إذا تم تحديد معرف طبيب، نعيد بيانات ذلك الطبيب فقط
      const result = doctorId 
        ? mockDoctorPerformance.find(d => d.doctorId === doctorId) 
        : mockDoctorPerformance;
      
      setError(null);
      return result;
    } catch (err) {
      console.error('Error fetching doctor performance:', err);
      setError('حدث خطأ أثناء جلب تحليلات أداء الأطباء');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // تحليلات المرضى
  const getPatientAnalytics = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPatientAnalytics: PatientAnalytics = {
        totalPatients: 200,
        newPatients: 30,
        returningPatients: 170,
        activePatients: 150,
        inactivePatients: 50,
        patientsByAge: {
          '0-18': 40,
          '19-30': 50,
          '31-45': 60,
          '46-60': 30,
          '60+': 20
        },
        patientsByGender: {
          'ذكر': 90,
          'أنثى': 110
        },
        patientsByLocation: {
          'الرياض': 120,
          'جدة': 50,
          'الدمام': 30
        },
        topPatientsByRevenue: [
          { patientId: 1, patientName: 'أحمد محمد', totalRevenue: 5000 },
          { patientId: 2, patientName: 'سارة أحمد', totalRevenue: 4500 },
          { patientId: 3, patientName: 'محمد علي', totalRevenue: 4000 }
        ],
        patientRetentionRate: 85, // نسبة مئوية
        averageVisitsPerPatient: 3.5
      };
      
      setError(null);
      return mockPatientAnalytics;
    } catch (err) {
      console.error('Error fetching patient analytics:', err);
      setError('حدث خطأ أثناء جلب تحليلات المرضى');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // تحليلات المخزون
  const getInventoryAnalytics = async () => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInventoryAnalytics = {
        totalItems: 100,
        totalValue: 50000,
        lowStockItems: 15,
        outOfStockItems: 5,
        topConsumedItems: [
          { itemId: 1, itemName: 'حشوات أسنان', consumptionCount: 50 },
          { itemId: 2, itemName: 'قفازات طبية', consumptionCount: 200 },
          { itemId: 3, itemName: 'إبر تخدير', consumptionCount: 100 }
        ],
        inventoryTurnoverRate: 3.5, // معدل دوران المخزون
        averageSupplyDuration: 45, // متوسط مدة التوريد بالأيام
        inventoryCostByMonth: {
          'يناير': 5000,
          'فبراير': 7000,
          'مارس': 6000,
          'أبريل': 8000,
          'مايو': 4000
        },
        supplierPerformance: [
          { supplierId: 1, supplierName: 'شركة الأسنان الطبية', reliabilityScore: 4.8, averageDeliveryTime: 3 },
          { supplierId: 2, supplierName: 'مستلزمات طب الأسنان', reliabilityScore: 4.5, averageDeliveryTime: 5 },
          { supplierId: 3, supplierName: 'المورد الطبي', reliabilityScore: 4.2, averageDeliveryTime: 7 }
        ]
      };
      
      setError(null);
      return mockInventoryAnalytics;
    } catch (err) {
      console.error('Error fetching inventory analytics:', err);
      setError('حدث خطأ أثناء جلب تحليلات المخزون');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // توقعات الإيرادات المستقبلية
  const getRevenueForecast = async (months: number = 3) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentDate = new Date();
      const forecastData = [];
      
      for (let i = 1; i <= months; i++) {
        const forecastDate = new Date(currentDate);
        forecastDate.setMonth(currentDate.getMonth() + i);
        
        const monthName = forecastDate.toLocaleDateString('ar-SA', { month: 'long' });
        const forecastRevenue = 20000 + Math.floor(Math.random() * 5000); // قيمة عشوائية للتوضيح
        
        forecastData.push({
          month: monthName,
          revenue: forecastRevenue,
          appointments: 40 + Math.floor(Math.random() * 10),
          newPatients: 10 + Math.floor(Math.random() * 5)
        });
      }
      
      setError(null);
      return forecastData;
    } catch (err) {
      console.error('Error generating revenue forecast:', err);
      setError('حدث خطأ أثناء إنشاء توقعات الإيرادات');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // تقرير الأداء العام للعيادة
  const getClinicPerformanceReport = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // جمع البيانات من مختلف التحليلات
      const appointmentAnalytics = await getAppointmentAnalytics(startDate, endDate);
      const revenueAnalytics = await getRevenueAnalytics(startDate, endDate);
      const patientAnalytics = await getPatientAnalytics(startDate, endDate);
      
      const performanceReport = {
        period: {
          startDate,
          endDate
        },
        summary: {
          totalRevenue: revenueAnalytics.totalRevenue,
          totalAppointments: appointmentAnalytics.totalAppointments,
          completionRate: (appointmentAnalytics.completedAppointments / appointmentAnalytics.totalAppointments) * 100,
          newPatients: patientAnalytics.newPatients,
          averagePatientSatisfaction: 4.6
        },
        keyMetrics: {
          revenueGrowth: 15, // نسبة مئوية
          patientGrowth: 10, // نسبة مئوية
          appointmentGrowth: 12, // نسبة مئوية
          averageRevenuePerAppointment: revenueAnalytics.totalRevenue / appointmentAnalytics.completedAppointments
        },
        recommendations: [
          'زيادة عدد المواعيد في أوقات الذروة',
          'التركيز على خدمات علاج العصب وحشو الأسنان لزيادة الإيرادات',
          'تحسين معدل الاحتفاظ بالمرضى من خلال برامج الولاء',
          'تقليل معدل إلغاء المواعيد من خلال تذكيرات إضافية'
        ]
      };
      
      setError(null);
      return performanceReport;
    } catch (err) {
      console.error('Error generating clinic performance report:', err);
      setError('حدث خطأ أثناء إنشاء تقرير أداء العيادة');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    getAppointmentAnalytics,
    getRevenueAnalytics,
    getDoctorPerformance,
    getPatientAnalytics,
    getInventoryAnalytics,
    getRevenueForecast,
    getClinicPerformanceReport
  };
}

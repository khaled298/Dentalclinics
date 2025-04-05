import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsPage from '../../src/app/analytics/page';

// Mock hooks
vi.mock('../../src/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    loading: false,
    error: null,
    getAppointmentAnalytics: vi.fn().mockResolvedValue({
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
      }
    }),
    getRevenueAnalytics: vi.fn().mockResolvedValue({
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
      }
    }),
    getDoctorPerformance: vi.fn().mockResolvedValue([
      {
        doctorId: 1,
        doctorName: 'د. سمير علي',
        totalAppointments: 50,
        completedAppointments: 45,
        totalRevenue: 30000,
        patientSatisfaction: 4.8,
        servicesPerformed: [
          { name: 'فحص أسنان', count: 20 },
          { name: 'حشو أسنان', count: 15 }
        ]
      },
      {
        doctorId: 2,
        doctorName: 'د. ليلى حسن',
        totalAppointments: 40,
        completedAppointments: 35,
        totalRevenue: 25000,
        patientSatisfaction: 4.6,
        servicesPerformed: [
          { name: 'تقويم الأسنان', count: 20 },
          { name: 'فحص أسنان', count: 15 }
        ]
      }
    ]),
    getPatientAnalytics: vi.fn().mockResolvedValue({
      totalPatients: 200,
      newPatients: 30,
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
      patientRetentionRate: 85
    }),
    getClinicPerformanceReport: vi.fn().mockResolvedValue({
      period: {
        startDate: '2023-08-01',
        endDate: '2023-09-01'
      },
      summary: {
        totalRevenue: 75000,
        totalAppointments: 120,
        completionRate: 79.2,
        newPatients: 30,
        averagePatientSatisfaction: 4.6
      },
      keyMetrics: {
        revenueGrowth: 15,
        patientGrowth: 10,
        appointmentGrowth: 12
      },
      recommendations: [
        'زيادة عدد المواعيد في أوقات الذروة',
        'التركيز على خدمات علاج العصب وحشو الأسنان لزيادة الإيرادات'
      ]
    })
  }),
}));

describe('Analytics Page Integration Test', () => {
  it('renders analytics dashboard correctly', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('لوحة التحليلات')).toBeInTheDocument();
      
      // Check summary cards
      expect(screen.getByText('إجمالي الإيرادات')).toBeInTheDocument();
      expect(screen.getByText('75000 ريال')).toBeInTheDocument();
      expect(screen.getByText('إجمالي المواعيد')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
      expect(screen.getByText('المرضى الجدد')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('رضا المرضى')).toBeInTheDocument();
      expect(screen.getByText('4.6/5')).toBeInTheDocument();
      
      // Check appointment analytics
      expect(screen.getByText('تحليلات المواعيد')).toBeInTheDocument();
      expect(screen.getByText('توزيع المواعيد حسب اليوم')).toBeInTheDocument();
      expect(screen.getByText('توزيع المواعيد حسب النوع')).toBeInTheDocument();
      
      // Check revenue analytics
      expect(screen.getByText('تحليلات الإيرادات')).toBeInTheDocument();
      expect(screen.getByText('الإيرادات حسب الشهر')).toBeInTheDocument();
      expect(screen.getByText('الإيرادات حسب الخدمة')).toBeInTheDocument();
      
      // Check doctor performance
      expect(screen.getByText('أداء الأطباء')).toBeInTheDocument();
      expect(screen.getByText('د. سمير علي')).toBeInTheDocument();
      expect(screen.getByText('د. ليلى حسن')).toBeInTheDocument();
      
      // Check patient analytics
      expect(screen.getByText('تحليلات المرضى')).toBeInTheDocument();
      expect(screen.getByText('توزيع المرضى حسب العمر')).toBeInTheDocument();
      expect(screen.getByText('توزيع المرضى حسب الجنس')).toBeInTheDocument();
      
      // Check recommendations
      expect(screen.getByText('التوصيات')).toBeInTheDocument();
      expect(screen.getByText('زيادة عدد المواعيد في أوقات الذروة')).toBeInTheDocument();
      expect(screen.getByText('التركيز على خدمات علاج العصب وحشو الأسنان لزيادة الإيرادات')).toBeInTheDocument();
    });
  });

  it('changes date range and updates analytics', async () => {
    const { useAnalytics } = require('../../src/hooks/useAnalytics');
    
    render(<AnalyticsPage />);
    
    // Change date range
    const startDateInput = screen.getByLabelText('من تاريخ');
    const endDateInput = screen.getByLabelText('إلى تاريخ');
    
    fireEvent.change(startDateInput, { target: { value: '2023-08-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-09-01' } });
    
    await waitFor(() => {
      expect(useAnalytics().getAppointmentAnalytics).toHaveBeenCalledWith('2023-08-01', '2023-09-01');
      expect(useAnalytics().getRevenueAnalytics).toHaveBeenCalledWith('2023-08-01', '2023-09-01');
      expect(useAnalytics().getDoctorPerformance).toHaveBeenCalledWith('2023-08-01', '2023-09-01');
      expect(useAnalytics().getPatientAnalytics).toHaveBeenCalledWith('2023-08-01', '2023-09-01');
      expect(useAnalytics().getClinicPerformanceReport).toHaveBeenCalledWith('2023-08-01', '2023-09-01');
    });
  });

  it('navigates to full reports page', async () => {
    render(<AnalyticsPage />);
    
    const reportsButton = screen.getByRole('button', { name: 'عرض جميع التقارير' });
    
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    
    fireEvent.click(reportsButton);
    
    expect(window.location.href).toBe('/reports');
    
    // Restore original location
    window.location = originalLocation;
  });
});

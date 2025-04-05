import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppointmentsPage from '../../src/app/appointments/page';

// Mock hooks
vi.mock('../../src/hooks/useAppointments', () => ({
  useAppointments: () => ({
    appointments: [
      { 
        id: 1, 
        patient_id: 1, 
        patient_name: 'أحمد محمد',
        doctor_id: 1, 
        doctor_name: 'د. سمير علي',
        appointment_date: '2023-09-20', 
        start_time: '09:00', 
        end_time: '09:30', 
        type: 'فحص', 
        status: 'مؤكد' 
      },
      { 
        id: 2, 
        patient_id: 2, 
        patient_name: 'سارة أحمد',
        doctor_id: 2, 
        doctor_name: 'د. ليلى حسن',
        appointment_date: '2023-09-20', 
        start_time: '10:30', 
        end_time: '11:15', 
        type: 'علاج', 
        status: 'مؤكد' 
      }
    ],
    loading: false,
    error: null,
    fetchAppointments: vi.fn(),
    fetchAppointmentsByDate: vi.fn(),
    addAppointment: vi.fn(),
    editAppointment: vi.fn(),
    removeAppointment: vi.fn(),
    isTimeSlotAvailable: vi.fn().mockReturnValue(true)
  }),
}));

vi.mock('../../src/hooks/usePatients', () => ({
  usePatients: () => ({
    patients: [
      { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com' },
      { id: 2, name: 'سارة أحمد', phone: '0551234567', email: 'sara@example.com' }
    ],
    loading: false,
    error: null,
    fetchPatients: vi.fn()
  }),
}));

describe('Appointments Page Integration Test', () => {
  it('renders appointments list correctly', () => {
    render(<AppointmentsPage />);
    
    expect(screen.getByText('إدارة المواعيد')).toBeInTheDocument();
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة أحمد')).toBeInTheDocument();
    expect(screen.getByText('د. سمير علي')).toBeInTheDocument();
    expect(screen.getByText('د. ليلى حسن')).toBeInTheDocument();
  });

  it('filters appointments by date', async () => {
    const { useAppointments } = require('../../src/hooks/useAppointments');
    
    render(<AppointmentsPage />);
    
    const datePicker = screen.getByLabelText('تاريخ المواعيد');
    fireEvent.change(datePicker, { target: { value: '2023-09-21' } });
    
    await waitFor(() => {
      expect(useAppointments().fetchAppointmentsByDate).toHaveBeenCalledWith('2023-09-21');
    });
  });

  it('opens new appointment form', async () => {
    render(<AppointmentsPage />);
    
    const addButton = screen.getByRole('button', { name: 'موعد جديد' });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('إضافة موعد جديد')).toBeInTheDocument();
      expect(screen.getByLabelText('المريض')).toBeInTheDocument();
      expect(screen.getByLabelText('الطبيب')).toBeInTheDocument();
      expect(screen.getByLabelText('التاريخ')).toBeInTheDocument();
      expect(screen.getByLabelText('وقت البدء')).toBeInTheDocument();
      expect(screen.getByLabelText('وقت الانتهاء')).toBeInTheDocument();
      expect(screen.getByLabelText('نوع الموعد')).toBeInTheDocument();
    });
  });

  it('submits new appointment form', async () => {
    const { useAppointments } = require('../../src/hooks/useAppointments');
    
    render(<AppointmentsPage />);
    
    // Open form
    const addButton = screen.getByRole('button', { name: 'موعد جديد' });
    fireEvent.click(addButton);
    
    // Fill form
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('المريض'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('الطبيب'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('التاريخ'), { target: { value: '2023-09-25' } });
      fireEvent.change(screen.getByLabelText('وقت البدء'), { target: { value: '14:00' } });
      fireEvent.change(screen.getByLabelText('وقت الانتهاء'), { target: { value: '14:30' } });
      fireEvent.change(screen.getByLabelText('نوع الموعد'), { target: { value: 'فحص' } });
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'حفظ' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(useAppointments().addAppointment).toHaveBeenCalledWith({
        patient_id: '1',
        doctor_id: '1',
        appointment_date: '2023-09-25',
        start_time: '14:00',
        end_time: '14:30',
        type: 'فحص',
        status: 'مؤكد'
      });
    });
  });

  it('opens edit appointment form', async () => {
    render(<AppointmentsPage />);
    
    const editButtons = screen.getAllByRole('button', { name: 'تعديل' });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('تعديل الموعد')).toBeInTheDocument();
      expect(screen.getByDisplayValue('أحمد محمد')).toBeInTheDocument();
      expect(screen.getByDisplayValue('د. سمير علي')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2023-09-20')).toBeInTheDocument();
      expect(screen.getByDisplayValue('09:00')).toBeInTheDocument();
      expect(screen.getByDisplayValue('09:30')).toBeInTheDocument();
      expect(screen.getByDisplayValue('فحص')).toBeInTheDocument();
    });
  });

  it('deletes an appointment', async () => {
    const { useAppointments } = require('../../src/hooks/useAppointments');
    
    render(<AppointmentsPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: 'حذف' });
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: 'تأكيد' });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(useAppointments().removeAppointment).toHaveBeenCalledWith(1);
    });
  });
});

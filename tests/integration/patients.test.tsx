import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientsPage from '../../src/app/patients/page';

// Mock hooks
vi.mock('../../src/hooks/usePatients', () => ({
  usePatients: () => ({
    patients: [
      { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com', date_of_birth: '1985-05-15', gender: 'ذكر', address: 'الرياض' },
      { id: 2, name: 'سارة أحمد', phone: '0551234567', email: 'sara@example.com', date_of_birth: '1990-10-20', gender: 'أنثى', address: 'جدة' }
    ],
    loading: false,
    error: null,
    fetchPatients: vi.fn(),
    addPatient: vi.fn(),
    editPatient: vi.fn(),
    removePatient: vi.fn(),
    searchPatients: vi.fn()
  }),
}));

describe('Patients Page Integration Test', () => {
  it('renders patients list correctly', () => {
    render(<PatientsPage />);
    
    expect(screen.getByText('إدارة المرضى')).toBeInTheDocument();
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة أحمد')).toBeInTheDocument();
    expect(screen.getByText('0501234567')).toBeInTheDocument();
    expect(screen.getByText('0551234567')).toBeInTheDocument();
  });

  it('searches for patients', async () => {
    const { usePatients } = require('../../src/hooks/usePatients');
    
    render(<PatientsPage />);
    
    const searchInput = screen.getByPlaceholderText('بحث عن مريض...');
    fireEvent.change(searchInput, { target: { value: 'أحمد' } });
    
    await waitFor(() => {
      expect(usePatients().searchPatients).toHaveBeenCalledWith('أحمد');
    });
  });

  it('opens new patient form', async () => {
    render(<PatientsPage />);
    
    const addButton = screen.getByRole('button', { name: 'مريض جديد' });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('إضافة مريض جديد')).toBeInTheDocument();
      expect(screen.getByLabelText('الاسم')).toBeInTheDocument();
      expect(screen.getByLabelText('رقم الهاتف')).toBeInTheDocument();
      expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
      expect(screen.getByLabelText('تاريخ الميلاد')).toBeInTheDocument();
      expect(screen.getByLabelText('الجنس')).toBeInTheDocument();
      expect(screen.getByLabelText('العنوان')).toBeInTheDocument();
    });
  });

  it('submits new patient form', async () => {
    const { usePatients } = require('../../src/hooks/usePatients');
    
    render(<PatientsPage />);
    
    // Open form
    const addButton = screen.getByRole('button', { name: 'مريض جديد' });
    fireEvent.click(addButton);
    
    // Fill form
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('الاسم'), { target: { value: 'محمد علي' } });
      fireEvent.change(screen.getByLabelText('رقم الهاتف'), { target: { value: '0561234567' } });
      fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), { target: { value: 'mohamed@example.com' } });
      fireEvent.change(screen.getByLabelText('تاريخ الميلاد'), { target: { value: '1980-01-01' } });
      fireEvent.change(screen.getByLabelText('الجنس'), { target: { value: 'ذكر' } });
      fireEvent.change(screen.getByLabelText('العنوان'), { target: { value: 'الدمام' } });
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'حفظ' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(usePatients().addPatient).toHaveBeenCalledWith({
        name: 'محمد علي',
        phone: '0561234567',
        email: 'mohamed@example.com',
        date_of_birth: '1980-01-01',
        gender: 'ذكر',
        address: 'الدمام'
      });
    });
  });

  it('opens patient details view', async () => {
    render(<PatientsPage />);
    
    const viewButtons = screen.getAllByRole('button', { name: 'عرض' });
    fireEvent.click(viewButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('بيانات المريض')).toBeInTheDocument();
      expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
      expect(screen.getByText('0501234567')).toBeInTheDocument();
      expect(screen.getByText('ahmed@example.com')).toBeInTheDocument();
      expect(screen.getByText('1985-05-15')).toBeInTheDocument();
      expect(screen.getByText('ذكر')).toBeInTheDocument();
      expect(screen.getByText('الرياض')).toBeInTheDocument();
    });
  });

  it('opens edit patient form', async () => {
    render(<PatientsPage />);
    
    const editButtons = screen.getAllByRole('button', { name: 'تعديل' });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('تعديل بيانات المريض')).toBeInTheDocument();
      expect(screen.getByDisplayValue('أحمد محمد')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0501234567')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ahmed@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1985-05-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ذكر')).toBeInTheDocument();
      expect(screen.getByDisplayValue('الرياض')).toBeInTheDocument();
    });
  });

  it('deletes a patient', async () => {
    const { usePatients } = require('../../src/hooks/usePatients');
    
    render(<PatientsPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: 'حذف' });
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: 'تأكيد' });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(usePatients().removePatient).toHaveBeenCalledWith(1);
    });
  });
});

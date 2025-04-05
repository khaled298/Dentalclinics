import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAppointments } from '../../hooks/useAppointments';

// Mock API functions
vi.mock('../../lib/api/appointments', () => ({
  getAppointments: vi.fn(),
  getAppointmentsByPatient: vi.fn(),
  getAppointmentsByDoctor: vi.fn(),
  getAppointmentsByDate: vi.fn(),
  createAppointment: vi.fn(),
  updateAppointment: vi.fn(),
  deleteAppointment: vi.fn()
}));

import { 
  getAppointments, 
  getAppointmentsByPatient, 
  getAppointmentsByDoctor, 
  getAppointmentsByDate,
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from '../../lib/api/appointments';

describe('useAppointments Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch appointments on initial load', async () => {
    const mockAppointments = [
      { id: 1, patient_id: 1, doctor_id: 1, appointment_date: '2023-09-20', start_time: '09:00', end_time: '09:30', type: 'فحص', status: 'مؤكد' },
      { id: 2, patient_id: 2, doctor_id: 2, appointment_date: '2023-09-20', start_time: '10:30', end_time: '11:15', type: 'علاج', status: 'مؤكد' }
    ];
    
    getAppointments.mockResolvedValueOnce(mockAppointments);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getAppointments).toHaveBeenCalledTimes(1);
    expect(result.current.appointments).toEqual(mockAppointments);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch appointments by patient', async () => {
    const patientId = 1;
    const mockAppointments = [
      { id: 1, patient_id: patientId, doctor_id: 1, appointment_date: '2023-09-20', start_time: '09:00', end_time: '09:30', type: 'فحص', status: 'مؤكد' },
      { id: 3, patient_id: patientId, doctor_id: 3, appointment_date: '2023-09-25', start_time: '11:00', end_time: '11:30', type: 'متابعة', status: 'مؤكد' }
    ];
    
    getAppointments.mockResolvedValueOnce([]);
    getAppointmentsByPatient.mockResolvedValueOnce(mockAppointments);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.fetchPatientAppointments(patientId);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getAppointmentsByPatient).toHaveBeenCalledWith(patientId);
    expect(result.current.appointments).toEqual(mockAppointments);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch appointments by doctor', async () => {
    const doctorId = 2;
    const mockAppointments = [
      { id: 2, patient_id: 2, doctor_id: doctorId, appointment_date: '2023-09-20', start_time: '10:30', end_time: '11:15', type: 'علاج', status: 'مؤكد' },
      { id: 4, patient_id: 4, doctor_id: doctorId, appointment_date: '2023-09-21', start_time: '14:00', end_time: '14:45', type: 'علاج', status: 'مؤكد' }
    ];
    
    getAppointments.mockResolvedValueOnce([]);
    getAppointmentsByDoctor.mockResolvedValueOnce(mockAppointments);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.fetchDoctorAppointments(doctorId);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getAppointmentsByDoctor).toHaveBeenCalledWith(doctorId);
    expect(result.current.appointments).toEqual(mockAppointments);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch appointments by date', async () => {
    const date = '2023-09-20';
    const mockAppointments = [
      { id: 1, patient_id: 1, doctor_id: 1, appointment_date: date, start_time: '09:00', end_time: '09:30', type: 'فحص', status: 'مؤكد' },
      { id: 2, patient_id: 2, doctor_id: 2, appointment_date: date, start_time: '10:30', end_time: '11:15', type: 'علاج', status: 'مؤكد' }
    ];
    
    getAppointments.mockResolvedValueOnce([]);
    getAppointmentsByDate.mockResolvedValueOnce(mockAppointments);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.fetchAppointmentsByDate(date);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getAppointmentsByDate).toHaveBeenCalledWith(date);
    expect(result.current.appointments).toEqual(mockAppointments);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should add a new appointment', async () => {
    const newAppointment = { 
      patient_id: 3, 
      doctor_id: 1, 
      appointment_date: '2023-09-22', 
      start_time: '13:00', 
      end_time: '13:30', 
      type: 'فحص', 
      status: 'مؤكد' 
    };
    const createdAppointment = { id: 5, ...newAppointment };
    
    createAppointment.mockResolvedValueOnce(createdAppointment);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    // Mock initial fetch
    getAppointments.mockResolvedValueOnce([]);
    await waitForNextUpdate();
    
    // Test adding appointment
    act(() => {
      result.current.addAppointment(newAppointment);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(createAppointment).toHaveBeenCalledWith(newAppointment);
    expect(result.current.appointments).toEqual([createdAppointment]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update an existing appointment', async () => {
    const initialAppointments = [
      { id: 1, patient_id: 1, doctor_id: 1, appointment_date: '2023-09-20', start_time: '09:00', end_time: '09:30', type: 'فحص', status: 'مؤكد' }
    ];
    
    const updatedAppointment = { 
      id: 1, 
      patient_id: 1, 
      doctor_id: 1, 
      appointment_date: '2023-09-20', 
      start_time: '10:00', 
      end_time: '10:30', 
      type: 'فحص', 
      status: 'مؤكد' 
    };
    
    getAppointments.mockResolvedValueOnce(initialAppointments);
    updateAppointment.mockResolvedValueOnce(updatedAppointment);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.editAppointment(1, updatedAppointment);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(updateAppointment).toHaveBeenCalledWith(1, updatedAppointment);
    expect(result.current.appointments).toEqual([updatedAppointment]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should delete an appointment', async () => {
    const initialAppointments = [
      { id: 1, patient_id: 1, doctor_id: 1, appointment_date: '2023-09-20', start_time: '09:00', end_time: '09:30', type: 'فحص', status: 'مؤكد' },
      { id: 2, patient_id: 2, doctor_id: 2, appointment_date: '2023-09-20', start_time: '10:30', end_time: '11:15', type: 'علاج', status: 'مؤكد' }
    ];
    
    getAppointments.mockResolvedValueOnce(initialAppointments);
    deleteAppointment.mockResolvedValueOnce(undefined);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.removeAppointment(1);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(deleteAppointment).toHaveBeenCalledWith(1);
    expect(result.current.appointments).toEqual([initialAppointments[1]]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should check if time slot is available', async () => {
    const initialAppointments = [
      { id: 1, patient_id: 1, doctor_id: 1, appointment_date: '2023-09-20', start_time: '09:00', end_time: '09:30', type: 'فحص', status: 'مؤكد' },
      { id: 2, patient_id: 2, doctor_id: 2, appointment_date: '2023-09-20', start_time: '10:30', end_time: '11:15', type: 'علاج', status: 'مؤكد' }
    ];
    
    getAppointments.mockResolvedValueOnce(initialAppointments);
    
    const { result, waitForNextUpdate } = renderHook(() => useAppointments());
    
    await waitForNextUpdate();
    
    // Test available time slot (different doctor)
    const isAvailable1 = result.current.isTimeSlotAvailable(3, '2023-09-20', '09:00', '09:30');
    expect(isAvailable1).toBe(true);
    
    // Test unavailable time slot (same doctor, overlapping time)
    const isAvailable2 = result.current.isTimeSlotAvailable(1, '2023-09-20', '09:15', '09:45');
    expect(isAvailable2).toBe(false);
    
    // Test available time slot (same doctor, different time)
    const isAvailable3 = result.current.isTimeSlotAvailable(1, '2023-09-20', '10:00', '10:30');
    expect(isAvailable3).toBe(true);
    
    // Test available time slot (same doctor, different date)
    const isAvailable4 = result.current.isTimeSlotAvailable(1, '2023-09-21', '09:00', '09:30');
    expect(isAvailable4).toBe(true);
  });
});

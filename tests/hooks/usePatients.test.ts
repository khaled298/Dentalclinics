import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { usePatients } from '../../hooks/usePatients';

// Mock API functions
vi.mock('../../lib/api/patients', () => ({
  getPatients: vi.fn(),
  createPatient: vi.fn(),
  updatePatient: vi.fn(),
  deletePatient: vi.fn()
}));

import { getPatients, createPatient, updatePatient, deletePatient } from '../../lib/api/patients';

describe('usePatients Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch patients on initial load', async () => {
    const mockPatients = [
      { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com' },
      { id: 2, name: 'سارة أحمد', phone: '0551234567', email: 'sara@example.com' }
    ];
    
    getPatients.mockResolvedValueOnce(mockPatients);
    
    const { result, waitForNextUpdate } = renderHook(() => usePatients());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getPatients).toHaveBeenCalledTimes(1);
    expect(result.current.patients).toEqual(mockPatients);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle error when fetching patients fails', async () => {
    const error = new Error('فشل في جلب بيانات المرضى');
    getPatients.mockRejectedValueOnce(error);
    
    const { result, waitForNextUpdate } = renderHook(() => usePatients());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getPatients).toHaveBeenCalledTimes(1);
    expect(result.current.patients).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('حدث خطأ أثناء جلب بيانات المرضى');
  });

  it('should add a new patient', async () => {
    const newPatient = { name: 'محمد علي', phone: '0561234567', email: 'mohamed@example.com' };
    const createdPatient = { id: 3, ...newPatient };
    
    createPatient.mockResolvedValueOnce(createdPatient);
    
    const { result, waitForNextUpdate } = renderHook(() => usePatients());
    
    // Mock initial fetch
    getPatients.mockResolvedValueOnce([]);
    await waitForNextUpdate();
    
    // Test adding patient
    act(() => {
      result.current.addPatient(newPatient);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(createPatient).toHaveBeenCalledWith(newPatient);
    expect(result.current.patients).toEqual([createdPatient]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update an existing patient', async () => {
    const initialPatients = [
      { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com' }
    ];
    
    const updatedPatient = { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed.new@example.com' };
    
    getPatients.mockResolvedValueOnce(initialPatients);
    updatePatient.mockResolvedValueOnce(updatedPatient);
    
    const { result, waitForNextUpdate } = renderHook(() => usePatients());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.editPatient(1, updatedPatient);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(updatePatient).toHaveBeenCalledWith(1, updatedPatient);
    expect(result.current.patients).toEqual([updatedPatient]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should delete a patient', async () => {
    const initialPatients = [
      { id: 1, name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com' },
      { id: 2, name: 'سارة أحمد', phone: '0551234567', email: 'sara@example.com' }
    ];
    
    getPatients.mockResolvedValueOnce(initialPatients);
    deletePatient.mockResolvedValueOnce(undefined);
    
    const { result, waitForNextUpdate } = renderHook(() => usePatients());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.removePatient(1);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(deletePatient).toHaveBeenCalledWith(1);
    expect(result.current.patients).toEqual([initialPatients[1]]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});

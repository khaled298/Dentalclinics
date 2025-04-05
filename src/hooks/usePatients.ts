'use client';

import { useEffect, useState } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../../lib/api/patients';
import { Patient } from '../../lib/models';

// مدير حالة المرضى
export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب قائمة المرضى
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('حدث خطأ أثناء جلب بيانات المرضى');
    } finally {
      setLoading(false);
    }
  };

  // إضافة مريض جديد
  const addPatient = async (patient: Patient) => {
    setLoading(true);
    try {
      const newPatient = await createPatient(patient);
      setPatients([...patients, newPatient]);
      setError(null);
      return newPatient;
    } catch (err) {
      console.error('Error adding patient:', err);
      setError('حدث خطأ أثناء إضافة المريض');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث بيانات مريض
  const editPatient = async (id: number, patient: Patient) => {
    setLoading(true);
    try {
      const updatedPatient = await updatePatient(id, patient);
      setPatients(patients.map(p => p.id === id ? updatedPatient : p));
      setError(null);
      return updatedPatient;
    } catch (err) {
      console.error('Error updating patient:', err);
      setError('حدث خطأ أثناء تحديث بيانات المريض');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف مريض
  const removePatient = async (id: number) => {
    setLoading(true);
    try {
      await deletePatient(id);
      setPatients(patients.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError('حدث خطأ أثناء حذف المريض');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
    editPatient,
    removePatient
  };
}

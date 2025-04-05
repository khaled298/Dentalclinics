'use client';

import { useEffect, useState } from 'react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, getAppointmentsByPatient, getAppointmentsByDoctor, getAppointmentsByDate } from '../../lib/api/appointments';
import { Appointment } from '../../lib/models';

// مدير حالة المواعيد
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب قائمة المواعيد
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('حدث خطأ أثناء جلب بيانات المواعيد');
    } finally {
      setLoading(false);
    }
  };

  // جلب مواعيد مريض محدد
  const fetchPatientAppointments = async (patientId: number) => {
    setLoading(true);
    try {
      const data = await getAppointmentsByPatient(patientId);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
      setError('حدث خطأ أثناء جلب مواعيد المريض');
    } finally {
      setLoading(false);
    }
  };

  // جلب مواعيد طبيب محدد
  const fetchDoctorAppointments = async (doctorId: number) => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDoctor(doctorId);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
      setError('حدث خطأ أثناء جلب مواعيد الطبيب');
    } finally {
      setLoading(false);
    }
  };

  // جلب مواعيد تاريخ محدد
  const fetchAppointmentsByDate = async (date: string) => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDate(date);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments by date:', err);
      setError('حدث خطأ أثناء جلب مواعيد التاريخ المحدد');
    } finally {
      setLoading(false);
    }
  };

  // إضافة موعد جديد
  const addAppointment = async (appointment: Appointment) => {
    setLoading(true);
    try {
      const newAppointment = await createAppointment(appointment);
      setAppointments([...appointments, newAppointment]);
      setError(null);
      return newAppointment;
    } catch (err) {
      console.error('Error adding appointment:', err);
      setError('حدث خطأ أثناء إضافة الموعد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث بيانات موعد
  const editAppointment = async (id: number, appointment: Appointment) => {
    setLoading(true);
    try {
      const updatedAppointment = await updateAppointment(id, appointment);
      setAppointments(appointments.map(a => a.id === id ? updatedAppointment : a));
      setError(null);
      return updatedAppointment;
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('حدث خطأ أثناء تحديث بيانات الموعد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف موعد
  const removeAppointment = async (id: number) => {
    setLoading(true);
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter(a => a.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('حدث خطأ أثناء حذف الموعد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // التحقق من توفر موعد
  const isTimeSlotAvailable = (doctorId: number, date: string, startTime: string, endTime: string, excludeAppointmentId?: number) => {
    // استبعاد الموعد الحالي عند التحقق من التعديل
    const relevantAppointments = excludeAppointmentId 
      ? appointments.filter(a => a.id !== excludeAppointmentId)
      : appointments;
    
    // التحقق من عدم وجود تعارض مع المواعيد الأخرى لنفس الطبيب في نفس اليوم
    return !relevantAppointments.some(a => 
      a.doctor_id === doctorId && 
      a.appointment_date === date && 
      ((startTime >= a.start_time && startTime < a.end_time) || 
       (endTime > a.start_time && endTime <= a.end_time) ||
       (startTime <= a.start_time && endTime >= a.end_time))
    );
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    fetchPatientAppointments,
    fetchDoctorAppointments,
    fetchAppointmentsByDate,
    addAppointment,
    editAppointment,
    removeAppointment,
    isTimeSlotAvailable
  };
}

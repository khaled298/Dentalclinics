// واجهات برمجة التطبيقات للتعامل مع بيانات المواعيد
import { Appointment } from '../lib/models';

export async function getAppointments(): Promise<Appointment[]> {
  const { results } = await fetch('/api/appointments')
    .then(res => res.json());
  return results;
}

export async function getAppointmentById(id: number): Promise<Appointment> {
  const result = await fetch(`/api/appointments/${id}`)
    .then(res => res.json());
  return result;
}

export async function createAppointment(appointment: Appointment): Promise<Appointment> {
  const result = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
  }).then(res => res.json());
  return result;
}

export async function updateAppointment(id: number, appointment: Appointment): Promise<Appointment> {
  const result = await fetch(`/api/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
  }).then(res => res.json());
  return result;
}

export async function deleteAppointment(id: number): Promise<void> {
  await fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
}

export async function getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
  const { results } = await fetch(`/api/patients/${patientId}/appointments`)
    .then(res => res.json());
  return results;
}

export async function getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
  const { results } = await fetch(`/api/doctors/${doctorId}/appointments`)
    .then(res => res.json());
  return results;
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const { results } = await fetch(`/api/appointments/date/${date}`)
    .then(res => res.json());
  return results;
}

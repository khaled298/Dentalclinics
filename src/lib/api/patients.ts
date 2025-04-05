// واجهات برمجة التطبيقات للتعامل مع بيانات المرضى
import { Patient } from '../lib/models';

export async function getPatients(): Promise<Patient[]> {
  const { results } = await fetch('/api/patients')
    .then(res => res.json());
  return results;
}

export async function getPatientById(id: number): Promise<Patient> {
  const result = await fetch(`/api/patients/${id}`)
    .then(res => res.json());
  return result;
}

export async function createPatient(patient: Patient): Promise<Patient> {
  const result = await fetch('/api/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  }).then(res => res.json());
  return result;
}

export async function updatePatient(id: number, patient: Patient): Promise<Patient> {
  const result = await fetch(`/api/patients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  }).then(res => res.json());
  return result;
}

export async function deletePatient(id: number): Promise<void> {
  await fetch(`/api/patients/${id}`, {
    method: 'DELETE',
  });
}

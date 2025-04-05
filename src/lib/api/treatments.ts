// واجهات برمجة التطبيقات للتعامل مع بيانات العلاجات
import { Treatment, TreatmentRecord } from '../models';

export async function getTreatments(): Promise<Treatment[]> {
  const { results } = await fetch('/api/treatments')
    .then(res => res.json());
  return results;
}

export async function getTreatmentById(id: number): Promise<Treatment> {
  const result = await fetch(`/api/treatments/${id}`)
    .then(res => res.json());
  return result;
}

export async function createTreatment(treatment: Treatment): Promise<Treatment> {
  const result = await fetch('/api/treatments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(treatment),
  }).then(res => res.json());
  return result;
}

export async function updateTreatment(id: number, treatment: Treatment): Promise<Treatment> {
  const result = await fetch(`/api/treatments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(treatment),
  }).then(res => res.json());
  return result;
}

export async function deleteTreatment(id: number): Promise<void> {
  await fetch(`/api/treatments/${id}`, {
    method: 'DELETE',
  });
}

export async function getTreatmentRecords(patientId: number): Promise<TreatmentRecord[]> {
  const { results } = await fetch(`/api/patients/${patientId}/treatment-records`)
    .then(res => res.json());
  return results;
}

export async function getTreatmentRecordById(id: number): Promise<TreatmentRecord> {
  const result = await fetch(`/api/treatment-records/${id}`)
    .then(res => res.json());
  return result;
}

export async function createTreatmentRecord(record: TreatmentRecord): Promise<TreatmentRecord> {
  const result = await fetch('/api/treatment-records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  }).then(res => res.json());
  return result;
}

export async function updateTreatmentRecord(id: number, record: TreatmentRecord): Promise<TreatmentRecord> {
  const result = await fetch(`/api/treatment-records/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  }).then(res => res.json());
  return result;
}

export async function deleteTreatmentRecord(id: number): Promise<void> {
  await fetch(`/api/treatment-records/${id}`, {
    method: 'DELETE',
  });
}

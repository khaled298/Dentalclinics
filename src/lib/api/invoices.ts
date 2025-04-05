// واجهات برمجة التطبيقات للتعامل مع بيانات الفواتير
import { Invoice, InvoiceItem, Payment } from '../models';

export async function getInvoices(): Promise<Invoice[]> {
  const { results } = await fetch('/api/invoices')
    .then(res => res.json());
  return results;
}

export async function getInvoiceById(id: number): Promise<Invoice> {
  const result = await fetch(`/api/invoices/${id}`)
    .then(res => res.json());
  return result;
}

export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const result = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  }).then(res => res.json());
  return result;
}

export async function updateInvoice(id: number, invoice: Invoice): Promise<Invoice> {
  const result = await fetch(`/api/invoices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  }).then(res => res.json());
  return result;
}

export async function deleteInvoice(id: number): Promise<void> {
  await fetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
}

export async function getInvoicesByPatient(patientId: number): Promise<Invoice[]> {
  const { results } = await fetch(`/api/patients/${patientId}/invoices`)
    .then(res => res.json());
  return results;
}

export async function getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
  const { results } = await fetch(`/api/invoices/${invoiceId}/items`)
    .then(res => res.json());
  return results;
}

export async function addInvoiceItem(invoiceId: number, item: InvoiceItem): Promise<InvoiceItem> {
  const result = await fetch(`/api/invoices/${invoiceId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  }).then(res => res.json());
  return result;
}

export async function updateInvoiceItem(invoiceId: number, itemId: number, item: InvoiceItem): Promise<InvoiceItem> {
  const result = await fetch(`/api/invoices/${invoiceId}/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  }).then(res => res.json());
  return result;
}

export async function deleteInvoiceItem(invoiceId: number, itemId: number): Promise<void> {
  await fetch(`/api/invoices/${invoiceId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function getPayments(invoiceId: number): Promise<Payment[]> {
  const { results } = await fetch(`/api/invoices/${invoiceId}/payments`)
    .then(res => res.json());
  return results;
}

export async function addPayment(invoiceId: number, payment: Payment): Promise<Payment> {
  const result = await fetch(`/api/invoices/${invoiceId}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payment),
  }).then(res => res.json());
  return result;
}

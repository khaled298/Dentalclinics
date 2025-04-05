// واجهات برمجة التطبيقات للتعامل مع بيانات المخزون
import { InventoryItem, InventoryTransaction, Supplier } from '../models';

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const { results } = await fetch('/api/inventory')
    .then(res => res.json());
  return results;
}

export async function getInventoryItemById(id: number): Promise<InventoryItem> {
  const result = await fetch(`/api/inventory/${id}`)
    .then(res => res.json());
  return result;
}

export async function createInventoryItem(item: InventoryItem): Promise<InventoryItem> {
  const result = await fetch('/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  }).then(res => res.json());
  return result;
}

export async function updateInventoryItem(id: number, item: InventoryItem): Promise<InventoryItem> {
  const result = await fetch(`/api/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  }).then(res => res.json());
  return result;
}

export async function deleteInventoryItem(id: number): Promise<void> {
  await fetch(`/api/inventory/${id}`, {
    method: 'DELETE',
  });
}

export async function getInventoryTransactions(itemId?: number): Promise<InventoryTransaction[]> {
  const url = itemId 
    ? `/api/inventory/${itemId}/transactions` 
    : '/api/inventory-transactions';
  
  const { results } = await fetch(url)
    .then(res => res.json());
  return results;
}

export async function createInventoryTransaction(transaction: InventoryTransaction): Promise<InventoryTransaction> {
  const result = await fetch('/api/inventory-transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  }).then(res => res.json());
  return result;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { results } = await fetch('/api/suppliers')
    .then(res => res.json());
  return results;
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const result = await fetch(`/api/suppliers/${id}`)
    .then(res => res.json());
  return result;
}

export async function createSupplier(supplier: Supplier): Promise<Supplier> {
  const result = await fetch('/api/suppliers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplier),
  }).then(res => res.json());
  return result;
}

export async function updateSupplier(id: number, supplier: Supplier): Promise<Supplier> {
  const result = await fetch(`/api/suppliers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplier),
  }).then(res => res.json());
  return result;
}

export async function deleteSupplier(id: number): Promise<void> {
  await fetch(`/api/suppliers/${id}`, {
    method: 'DELETE',
  });
}

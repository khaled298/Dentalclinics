import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useInventory } from '../../hooks/useInventory';

// Mock API functions
vi.mock('../../lib/api/inventory', () => ({
  getInventoryItems: vi.fn(),
  getInventoryItemById: vi.fn(),
  createInventoryItem: vi.fn(),
  updateInventoryItem: vi.fn(),
  deleteInventoryItem: vi.fn(),
  getInventoryTransactions: vi.fn(),
  createInventoryTransaction: vi.fn(),
  getSuppliers: vi.fn(),
  getSupplierById: vi.fn(),
  createSupplier: vi.fn(),
  updateSupplier: vi.fn(),
  deleteSupplier: vi.fn()
}));

import { 
  getInventoryItems, 
  getInventoryItemById, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  getInventoryTransactions,
  createInventoryTransaction,
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../../lib/api/inventory';

describe('useInventory Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch inventory items and suppliers on initial load', async () => {
    const mockItems = [
      { id: 1, name: 'حشوات أسنان', current_quantity: 50, minimum_quantity: 10, unit_price: 20 },
      { id: 2, name: 'قفازات طبية', current_quantity: 200, minimum_quantity: 50, unit_price: 5 }
    ];
    
    const mockSuppliers = [
      { id: 1, name: 'شركة الأسنان الطبية', contact_person: 'أحمد محمد', phone: '0501234567', email: 'ahmed@dental.com' },
      { id: 2, name: 'مستلزمات طب الأسنان', contact_person: 'سارة أحمد', phone: '0551234567', email: 'sara@dental.com' }
    ];
    
    getInventoryItems.mockResolvedValueOnce(mockItems);
    getSuppliers.mockResolvedValueOnce(mockSuppliers);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getInventoryItems).toHaveBeenCalledTimes(1);
    expect(getSuppliers).toHaveBeenCalledTimes(1);
    expect(result.current.inventoryItems).toEqual(mockItems);
    expect(result.current.suppliers).toEqual(mockSuppliers);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch inventory transactions', async () => {
    const itemId = 1;
    const mockTransactions = [
      { id: 1, item_id: itemId, transaction_type: 'purchase', quantity: 20, transaction_date: '2023-09-10', supplier_id: 1 },
      { id: 2, item_id: itemId, transaction_type: 'consumption', quantity: 5, transaction_date: '2023-09-15' }
    ];
    
    getInventoryItems.mockResolvedValueOnce([]);
    getSuppliers.mockResolvedValueOnce([]);
    getInventoryTransactions.mockResolvedValueOnce(mockTransactions);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.fetchInventoryTransactions(itemId);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getInventoryTransactions).toHaveBeenCalledWith(itemId);
    expect(result.current.transactions).toEqual(mockTransactions);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should add a new inventory item', async () => {
    const newItem = { 
      name: 'إبر تخدير', 
      current_quantity: 100, 
      minimum_quantity: 20, 
      unit_price: 15 
    };
    const createdItem = { id: 3, ...newItem };
    
    createInventoryItem.mockResolvedValueOnce(createdItem);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    // Mock initial fetch
    getInventoryItems.mockResolvedValueOnce([]);
    getSuppliers.mockResolvedValueOnce([]);
    await waitForNextUpdate();
    
    // Test adding item
    act(() => {
      result.current.addInventoryItem(newItem);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(createInventoryItem).toHaveBeenCalledWith(newItem);
    expect(result.current.inventoryItems).toEqual([createdItem]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update an inventory item', async () => {
    const initialItems = [
      { id: 1, name: 'حشوات أسنان', current_quantity: 50, minimum_quantity: 10, unit_price: 20 }
    ];
    
    const updatedItem = { 
      id: 1, 
      name: 'حشوات أسنان', 
      current_quantity: 60, 
      minimum_quantity: 15, 
      unit_price: 25 
    };
    
    getInventoryItems.mockResolvedValueOnce(initialItems);
    getSuppliers.mockResolvedValueOnce([]);
    updateInventoryItem.mockResolvedValueOnce(updatedItem);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.updateItem(1, { current_quantity: 60, minimum_quantity: 15, unit_price: 25 });
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(updateInventoryItem).toHaveBeenCalledWith(1, { id: 1, current_quantity: 60, minimum_quantity: 15, unit_price: 25 });
    expect(result.current.inventoryItems).toEqual([updatedItem]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should add an inventory transaction and update item quantity', async () => {
    const initialItems = [
      { id: 1, name: 'حشوات أسنان', current_quantity: 50, minimum_quantity: 10, unit_price: 20 }
    ];
    
    const newTransaction = { 
      item_id: 1, 
      transaction_type: 'purchase', 
      quantity: 20, 
      transaction_date: '2023-09-20', 
      supplier_id: 1 
    };
    
    const createdTransaction = { id: 3, ...newTransaction };
    
    const updatedItem = { 
      id: 1, 
      name: 'حشوات أسنان', 
      current_quantity: 70, 
      minimum_quantity: 10, 
      unit_price: 20 
    };
    
    getInventoryItems.mockResolvedValueOnce(initialItems);
    getSuppliers.mockResolvedValueOnce([]);
    createInventoryTransaction.mockResolvedValueOnce(createdTransaction);
    updateInventoryItem.mockResolvedValueOnce(updatedItem);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.addInventoryTransaction(newTransaction);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(createInventoryTransaction).toHaveBeenCalledWith(newTransaction);
    expect(updateInventoryItem).toHaveBeenCalledWith(1, { current_quantity: 70 });
    expect(result.current.transactions).toEqual([createdTransaction]);
    expect(result.current.inventoryItems).toEqual([updatedItem]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should add a new supplier', async () => {
    const newSupplier = { 
      name: 'المورد الطبي', 
      contact_person: 'محمد علي', 
      phone: '0561234567', 
      email: 'mohamed@medical.com' 
    };
    const createdSupplier = { id: 3, ...newSupplier };
    
    createSupplier.mockResolvedValueOnce(createdSupplier);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    // Mock initial fetch
    getInventoryItems.mockResolvedValueOnce([]);
    getSuppliers.mockResolvedValueOnce([]);
    await waitForNextUpdate();
    
    // Test adding supplier
    act(() => {
      result.current.addSupplier(newSupplier);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(createSupplier).toHaveBeenCalledWith(newSupplier);
    expect(result.current.suppliers).toEqual([createdSupplier]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should identify items needing reorder', async () => {
    const mockItems = [
      { id: 1, name: 'حشوات أسنان', current_quantity: 50, minimum_quantity: 10, unit_price: 20 },
      { id: 2, name: 'قفازات طبية', current_quantity: 40, minimum_quantity: 50, unit_price: 5 },
      { id: 3, name: 'إبر تخدير', current_quantity: 5, minimum_quantity: 20, unit_price: 15 }
    ];
    
    getInventoryItems.mockResolvedValueOnce(mockItems);
    getSuppliers.mockResolvedValueOnce([]);
    
    const { result, waitForNextUpdate } = renderHook(() => useInventory());
    
    await waitForNextUpdate();
    
    const itemsNeedingReorder = result.current.getItemsNeedingReorder();
    expect(itemsNeedingReorder).toHaveLength(2);
    expect(itemsNeedingReorder).toEqual([mockItems[1], mockItems[2]]);
  });
});

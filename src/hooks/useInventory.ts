'use client';

import { useEffect, useState } from 'react';
import { getInventoryItems, getInventoryItemById, createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryTransactions, createInventoryTransaction, getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../../lib/api/inventory';
import { InventoryItem, InventoryTransaction, Supplier } from '../../lib/models';

// مدير حالة المخزون
export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب قائمة عناصر المخزون
  const fetchInventoryItems = async () => {
    setLoading(true);
    try {
      const data = await getInventoryItems();
      setInventoryItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
      setError('حدث خطأ أثناء جلب بيانات المخزون');
    } finally {
      setLoading(false);
    }
  };

  // جلب حركات المخزون
  const fetchInventoryTransactions = async (itemId?: number) => {
    setLoading(true);
    try {
      const data = await getInventoryTransactions(itemId);
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory transactions:', err);
      setError('حدث خطأ أثناء جلب حركات المخزون');
    } finally {
      setLoading(false);
    }
  };

  // جلب قائمة الموردين
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('حدث خطأ أثناء جلب بيانات الموردين');
    } finally {
      setLoading(false);
    }
  };

  // إضافة عنصر جديد للمخزون
  const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    setLoading(true);
    try {
      const newItem = await createInventoryItem(item);
      setInventoryItems([...inventoryItems, newItem]);
      setError(null);
      return newItem;
    } catch (err) {
      console.error('Error adding inventory item:', err);
      setError('حدث خطأ أثناء إضافة عنصر للمخزون');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث عنصر في المخزون
  const updateItem = async (id: number, item: Partial<InventoryItem>) => {
    setLoading(true);
    try {
      const updatedItem = await updateInventoryItem(id, { ...item, id });
      setInventoryItems(inventoryItems.map(i => i.id === id ? updatedItem : i));
      setError(null);
      return updatedItem;
    } catch (err) {
      console.error('Error updating inventory item:', err);
      setError('حدث خطأ أثناء تحديث عنصر المخزون');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف عنصر من المخزون
  const removeInventoryItem = async (id: number) => {
    setLoading(true);
    try {
      await deleteInventoryItem(id);
      setInventoryItems(inventoryItems.filter(i => i.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      setError('حدث خطأ أثناء حذف عنصر المخزون');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إضافة حركة مخزون جديدة
  const addInventoryTransaction = async (transaction: Omit<InventoryTransaction, 'id'>) => {
    setLoading(true);
    try {
      const newTransaction = await createInventoryTransaction(transaction);
      setTransactions([...transactions, newTransaction]);
      
      // تحديث كمية العنصر في المخزون
      const item = inventoryItems.find(i => i.id === transaction.item_id);
      if (item) {
        let newQuantity = item.current_quantity;
        
        switch (transaction.transaction_type) {
          case 'purchase':
            newQuantity += transaction.quantity;
            break;
          case 'consumption':
            newQuantity -= transaction.quantity;
            break;
          case 'adjustment':
            newQuantity = transaction.quantity; // تعديل مباشر للكمية
            break;
          case 'return':
            if (transaction.quantity > 0) {
              newQuantity += transaction.quantity; // إرجاع للمخزون
            } else {
              newQuantity -= Math.abs(transaction.quantity); // إرجاع من المخزون
            }
            break;
        }
        
        // تحديث كمية العنصر
        const updatedItem = await updateInventoryItem(item.id!, { current_quantity: newQuantity });
        setInventoryItems(inventoryItems.map(i => i.id === item.id ? updatedItem : i));
      }
      
      setError(null);
      return newTransaction;
    } catch (err) {
      console.error('Error adding inventory transaction:', err);
      setError('حدث خطأ أثناء إضافة حركة مخزون');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إضافة مورد جديد
  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    setLoading(true);
    try {
      const newSupplier = await createSupplier(supplier);
      setSuppliers([...suppliers, newSupplier]);
      setError(null);
      return newSupplier;
    } catch (err) {
      console.error('Error adding supplier:', err);
      setError('حدث خطأ أثناء إضافة مورد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث بيانات مورد
  const updateSupplierInfo = async (id: number, supplier: Partial<Supplier>) => {
    setLoading(true);
    try {
      const updatedSupplier = await updateSupplier(id, { ...supplier, id });
      setSuppliers(suppliers.map(s => s.id === id ? updatedSupplier : s));
      setError(null);
      return updatedSupplier;
    } catch (err) {
      console.error('Error updating supplier:', err);
      setError('حدث خطأ أثناء تحديث بيانات المورد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف مورد
  const removeSupplier = async (id: number) => {
    setLoading(true);
    try {
      await deleteSupplier(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError('حدث خطأ أثناء حذف المورد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // التحقق من العناصر التي تحتاج إلى إعادة طلب
  const getItemsNeedingReorder = () => {
    return inventoryItems.filter(item => item.current_quantity <= item.minimum_quantity);
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchInventoryItems();
    fetchSuppliers();
  }, []);

  return {
    inventoryItems,
    transactions,
    suppliers,
    loading,
    error,
    fetchInventoryItems,
    fetchInventoryTransactions,
    fetchSuppliers,
    addInventoryItem,
    updateItem,
    removeInventoryItem,
    addInventoryTransaction,
    addSupplier,
    updateSupplierInfo,
    removeSupplier,
    getItemsNeedingReorder
  };
}

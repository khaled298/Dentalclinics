'use client';

import { useEffect, useState } from 'react';
import { getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, getInvoicesByPatient, getInvoiceItems, addInvoiceItem, updateInvoiceItem, deleteInvoiceItem, getPayments, addPayment } from '../../lib/api/invoices';
import { Invoice, InvoiceItem, Payment } from '../../lib/models';

// مدير حالة الفواتير
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب قائمة الفواتير
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('حدث خطأ أثناء جلب بيانات الفواتير');
    } finally {
      setLoading(false);
    }
  };

  // جلب فاتورة محددة مع عناصرها والمدفوعات
  const fetchInvoiceDetails = async (id: number) => {
    setLoading(true);
    try {
      const invoice = await getInvoiceById(id);
      setSelectedInvoice(invoice);
      
      // جلب عناصر الفاتورة
      const items = await getInvoiceItems(id);
      setInvoiceItems(items);
      
      // جلب المدفوعات
      const paymentData = await getPayments(id);
      setPayments(paymentData);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      setError('حدث خطأ أثناء جلب تفاصيل الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  // جلب فواتير مريض محدد
  const fetchPatientInvoices = async (patientId: number) => {
    setLoading(true);
    try {
      const data = await getInvoicesByPatient(patientId);
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching patient invoices:', err);
      setError('حدث خطأ أثناء جلب فواتير المريض');
    } finally {
      setLoading(false);
    }
  };

  // إنشاء فاتورة جديدة
  const createNewInvoice = async (invoice: Invoice, items: Omit<InvoiceItem, 'id' | 'invoice_id'>[]) => {
    setLoading(true);
    try {
      // إنشاء الفاتورة
      const newInvoice = await createInvoice(invoice);
      
      // إضافة عناصر الفاتورة
      const invoiceItems = await Promise.all(
        items.map(item => addInvoiceItem(newInvoice.id!, { ...item, invoice_id: newInvoice.id! }))
      );
      
      setInvoices([...invoices, newInvoice]);
      setSelectedInvoice(newInvoice);
      setInvoiceItems(invoiceItems);
      setError(null);
      
      return { invoice: newInvoice, items: invoiceItems };
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('حدث خطأ أثناء إنشاء الفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث فاتورة
  const updateExistingInvoice = async (id: number, invoice: Invoice) => {
    setLoading(true);
    try {
      const updatedInvoice = await updateInvoice(id, invoice);
      setInvoices(invoices.map(inv => inv.id === id ? updatedInvoice : inv));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(updatedInvoice);
      }
      setError(null);
      return updatedInvoice;
    } catch (err) {
      console.error('Error updating invoice:', err);
      setError('حدث خطأ أثناء تحديث الفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف فاتورة
  const removeInvoice = async (id: number) => {
    setLoading(true);
    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter(inv => inv.id !== id));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(null);
        setInvoiceItems([]);
        setPayments([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('حدث خطأ أثناء حذف الفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إضافة عنصر للفاتورة
  const addItemToInvoice = async (invoiceId: number, item: Omit<InvoiceItem, 'id' | 'invoice_id'>) => {
    setLoading(true);
    try {
      const newItem = await addInvoiceItem(invoiceId, { ...item, invoice_id: invoiceId });
      setInvoiceItems([...invoiceItems, newItem]);
      setError(null);
      return newItem;
    } catch (err) {
      console.error('Error adding invoice item:', err);
      setError('حدث خطأ أثناء إضافة عنصر للفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث عنصر في الفاتورة
  const updateInvoiceItemDetails = async (invoiceId: number, itemId: number, item: Partial<InvoiceItem>) => {
    setLoading(true);
    try {
      const updatedItem = await updateInvoiceItem(invoiceId, itemId, { ...item, id: itemId, invoice_id: invoiceId });
      setInvoiceItems(invoiceItems.map(itm => itm.id === itemId ? updatedItem : itm));
      setError(null);
      return updatedItem;
    } catch (err) {
      console.error('Error updating invoice item:', err);
      setError('حدث خطأ أثناء تحديث عنصر الفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف عنصر من الفاتورة
  const removeInvoiceItem = async (invoiceId: number, itemId: number) => {
    setLoading(true);
    try {
      await deleteInvoiceItem(invoiceId, itemId);
      setInvoiceItems(invoiceItems.filter(itm => itm.id !== itemId));
      setError(null);
    } catch (err) {
      console.error('Error deleting invoice item:', err);
      setError('حدث خطأ أثناء حذف عنصر الفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إضافة دفعة للفاتورة
  const addPaymentToInvoice = async (invoiceId: number, payment: Omit<Payment, 'id'>) => {
    setLoading(true);
    try {
      const newPayment = await addPayment(invoiceId, { ...payment, invoice_id: invoiceId });
      setPayments([...payments, newPayment]);
      
      // تحديث حالة الفاتورة إذا لزم الأمر
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        const totalPaid = [...payments, newPayment].reduce((sum, p) => sum + p.amount, 0);
        let newStatus = selectedInvoice.status;
        
        if (totalPaid >= selectedInvoice.final_amount) {
          newStatus = 'paid';
        } else if (totalPaid > 0) {
          newStatus = 'partially_paid';
        }
        
        if (newStatus !== selectedInvoice.status) {
          const updatedInvoice = await updateInvoice(invoiceId, { ...selectedInvoice, status: newStatus });
          setSelectedInvoice(updatedInvoice);
          setInvoices(invoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv));
        }
      }
      
      setError(null);
      return newPayment;
    } catch (err) {
      console.error('Error adding payment:', err);
      setError('حدث خطأ أثناء إضافة دفعة للفاتورة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حساب إجمالي المدفوعات للفاتورة
  const calculateTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  // حساب المبلغ المتبقي للفاتورة
  const calculateRemainingAmount = () => {
    if (!selectedInvoice) return 0;
    const totalPaid = calculateTotalPaid();
    return Math.max(0, selectedInvoice.final_amount - totalPaid);
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    selectedInvoice,
    invoiceItems,
    payments,
    loading,
    error,
    fetchInvoices,
    fetchInvoiceDetails,
    fetchPatientInvoices,
    createNewInvoice,
    updateExistingInvoice,
    removeInvoice,
    addItemToInvoice,
    updateInvoiceItemDetails,
    removeInvoiceItem,
    addPaymentToInvoice,
    calculateTotalPaid,
    calculateRemainingAmount
  };
}

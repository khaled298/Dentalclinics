import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useInvoices } from '../../hooks/useInvoices';

// Mock API functions
vi.mock('../../lib/api/invoices', () => ({
  getInvoices: vi.fn(),
  getInvoiceById: vi.fn(),
  createInvoice: vi.fn(),
  updateInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
  getInvoicesByPatient: vi.fn(),
  getInvoiceItems: vi.fn(),
  addInvoiceItem: vi.fn(),
  updateInvoiceItem: vi.fn(),
  deleteInvoiceItem: vi.fn(),
  getPayments: vi.fn(),
  addPayment: vi.fn()
}));

import { 
  getInvoices, 
  getInvoiceById, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice,
  getInvoicesByPatient,
  getInvoiceItems,
  addInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
  getPayments,
  addPayment
} from '../../lib/api/invoices';

describe('useInvoices Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch invoices on initial load', async () => {
    const mockInvoices = [
      { id: 1, patient_id: 1, date: '2023-09-15', final_amount: 500, status: 'paid', payment_method: 'cash' },
      { id: 2, patient_id: 2, date: '2023-09-10', final_amount: 1200, status: 'partially_paid', payment_method: 'credit_card' }
    ];
    
    getInvoices.mockResolvedValueOnce(mockInvoices);
    
    const { result, waitForNextUpdate } = renderHook(() => useInvoices());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getInvoices).toHaveBeenCalledTimes(1);
    expect(result.current.invoices).toEqual(mockInvoices);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch invoice details', async () => {
    const invoiceId = 1;
    const mockInvoice = { 
      id: invoiceId, 
      patient_id: 1, 
      date: '2023-09-15', 
      final_amount: 500, 
      status: 'paid', 
      payment_method: 'cash' 
    };
    
    const mockItems = [
      { id: 1, invoice_id: invoiceId, treatment_id: 1, quantity: 1, price: 200 },
      { id: 2, invoice_id: invoiceId, treatment_id: 2, quantity: 1, price: 300 }
    ];
    
    const mockPayments = [
      { id: 1, invoice_id: invoiceId, date: '2023-09-15', amount: 500, method: 'cash' }
    ];
    
    getInvoices.mockResolvedValueOnce([]);
    getInvoiceById.mockResolvedValueOnce(mockInvoice);
    getInvoiceItems.mockResolvedValueOnce(mockItems);
    getPayments.mockResolvedValueOnce(mockPayments);
    
    const { result, waitForNextUpdate } = renderHook(() => useInvoices());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.fetchInvoiceDetails(invoiceId);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(getInvoiceById).toHaveBeenCalledWith(invoiceId);
    expect(getInvoiceItems).toHaveBeenCalledWith(invoiceId);
    expect(getPayments).toHaveBeenCalledWith(invoiceId);
    expect(result.current.selectedInvoice).toEqual(mockInvoice);
    expect(result.current.invoiceItems).toEqual(mockItems);
    expect(result.current.payments).toEqual(mockPayments);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should create a new invoice with items', async () => {
    const newInvoice = { 
      patient_id: 3, 
      date: '2023-09-20', 
      final_amount: 800, 
      status: 'unpaid'
    };
    
    const createdInvoice = { id: 3, ...newInvoice };
    
    const newItems = [
      { treatment_id: 1, quantity: 1, price: 300 },
      { treatment_id: 2, quantity: 1, price: 500 }
    ];
    
    const createdItems = [
      { id: 3, invoice_id: 3, treatment_id: 1, quantity: 1, price: 300 },
      { id: 4, invoice_id: 3, treatment_id: 2, quantity: 1, price: 500 }
    ];
    
    createInvoice.mockResolvedValueOnce(createdInvoice);
    addInvoiceItem.mockResolvedValueOnce(createdItems[0]);
    addInvoiceItem.mockResolvedValueOnce(createdItems[1]);
    
    const { result, waitForNextUpdate } = renderHook(() => useInvoices());
    
    // Mock initial fetch
    getInvoices.mockResolvedValueOnce([]);
    await waitForNextUpdate();
    
    // Test creating invoice
    act(() => {
      result.current.createNewInvoice(newInvoice, newItems);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(createInvoice).toHaveBeenCalledWith(newInvoice);
    expect(addInvoiceItem).toHaveBeenCalledTimes(2);
    expect(result.current.invoices).toEqual([createdInvoice]);
    expect(result.current.selectedInvoice).toEqual(createdInvoice);
    expect(result.current.invoiceItems).toEqual(createdItems);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update an existing invoice', async () => {
    const initialInvoices = [
      { id: 1, patient_id: 1, date: '2023-09-15', final_amount: 500, status: 'paid', payment_method: 'cash' }
    ];
    
    const updatedInvoice = { 
      id: 1, 
      patient_id: 1, 
      date: '2023-09-15', 
      final_amount: 600, 
      status: 'paid', 
      payment_method: 'cash' 
    };
    
    getInvoices.mockResolvedValueOnce(initialInvoices);
    updateInvoice.mockResolvedValueOnce(updatedInvoice);
    
    const { result, waitForNextUpdate } = renderHook(() => useInvoices());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.updateExistingInvoice(1, updatedInvoice);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(updateInvoice).toHaveBeenCalledWith(1, updatedInvoice);
    expect(result.current.invoices).toEqual([updatedInvoice]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should add payment to invoice and update status', async () => {
    const invoiceId = 2;
    const initialInvoices = [
      { id: invoiceId, patient_id: 2, date: '2023-09-10', final_amount: 1200, status: 'partially_paid', payment_method: 'credit_card' }
    ];
    
    const mockPayments = [
      { id: 2, invoice_id: invoiceId, date: '2023-09-10', amount: 600, method: 'credit_card' }
    ];
    
    const newPayment = { 
      invoice_id: invoiceId, 
      date: '2023-09-20', 
      amount: 600, 
      method: 'cash' 
    };
    
    const createdPayment = { id: 3, ...newPayment };
    
    const updatedInvoice = { 
      id: invoiceId, 
      patient_id: 2, 
      date: '2023-09-10', 
      final_amount: 1200, 
      status: 'paid', 
      payment_method: 'credit_card' 
    };
    
    getInvoices.mockResolvedValueOnce(initialInvoices);
    getInvoiceById.mockResolvedValueOnce(initialInvoices[0]);
    getInvoiceItems.mockResolvedValueOnce([]);
    getPayments.mockResolvedValueOnce(mockPayments);
    addPayment.mockResolvedValueOnce(createdPayment);
    updateInvoice.mockResolvedValueOnce(updatedInvoice);
    
    const { result, waitForNextUpdate } = renderHook(() => useInvoices());
    
    await waitForNextUpdate();
    
    // First fetch invoice details
    act(() => {
      result.current.fetchInvoiceDetails(invoiceId);
    });
    
    await waitForNextUpdate();
    
    // Then add payment
    act(() => {
      result.current.addPaymentToInvoice(invoiceId, newPayment);
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(addPayment).toHaveBeenCalledWith(invoiceId, newPayment);
    expect(updateInvoice).toHaveBeenCalled();
    expect(result.current.payments).toEqual([...mockPayments, createdPayment]);
    expect(result.current.selectedInvoice).toEqual(updatedInvoice);
    expect(result.current.invoices).toEqual([updatedInvoice]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should calculate total paid and remaining amount', async () => {
    const invoiceId = 2;
    const invoice = { 
      id: invoiceId, 
      patient_id: 2, 
      date: '2023-09-10', 
      final_amount: 1200, 
      status: 'partially_paid', 
      payment_method: 'credit_card' 
    };
    
    const mockPayments = [
      { id: 2, invoice_id: invoiceId, date: '2023-09-10', amount: 500, method: 'credit_card' },
      { id: 3, invoice_id: invoiceId, date: '2023-09-15', amount: 300, method: 'cash' }
    ];
    
    getInvoices.mockResolvedValueOnce([invoice]);
    getInvoiceById.mockResolvedValueOnce(invoice);
    getInvoiceItems.mockResolvedValueOnce([]);
    getPayments.mockResolvedValueOnce(mockPayments);
    
    const { result, waitForNextUpdate } = renderHook(() => useInvoices());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.fetchInvoiceDetails(invoiceId);
    });
    
    await waitForNextUpdate();
    
    const totalPaid = result.current.calculateTotalPaid();
    expect(totalPaid).toBe(800);
    
    const remainingAmount = result.current.calculateRemainingAmount();
    expect(remainingAmount).toBe(400);
  });
});

'use client';

import React, { useState } from 'react';
import { Navbar, Card, Button, Table, Input, Select, Alert, Spinner } from '../../components/ui';

export default function InvoicesPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // بيانات وهمية للفواتير
  const invoices = [
    { id: 1, patientName: 'أحمد محمد', date: '2023-09-15', amount: 500, status: 'مدفوعة', paymentMethod: 'نقدي' },
    { id: 2, patientName: 'سارة أحمد', date: '2023-09-10', amount: 1200, status: 'مدفوعة جزئياً', paymentMethod: 'بطاقة ائتمان' },
    { id: 3, patientName: 'محمد علي', date: '2023-08-25', amount: 800, status: 'غير مدفوعة', paymentMethod: '-' },
    { id: 4, patientName: 'فاطمة حسن', date: '2023-08-20', amount: 350, status: 'مدفوعة', paymentMethod: 'تأمين' },
    { id: 5, patientName: 'خالد عبدالله', date: '2023-07-15', amount: 1500, status: 'ملغاة', paymentMethod: '-' },
  ];

  // أعمدة جدول الفواتير
  const invoiceColumns = [
    { header: 'رقم الفاتورة', cell: (row) => `#${row.id}` },
    { header: 'اسم المريض', accessor: 'patientName' },
    { header: 'التاريخ', accessor: 'date' },
    { header: 'المبلغ', cell: (row) => `${row.amount} ريال` },
    { header: 'الحالة', accessor: 'status' },
    { header: 'طريقة الدفع', accessor: 'paymentMethod' },
    { 
      header: 'الإجراءات', 
      cell: (row) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={() => {
              setSelectedInvoice(row);
              setShowInvoiceDetails(true);
            }}
          >
            عرض
          </Button>
          <Button variant="primary" size="sm" className="ml-2">تعديل</Button>
          <Button variant="danger" size="sm">حذف</Button>
        </div>
      ) 
    },
  ];

  // روابط القائمة الرئيسية
  const navLinks = [
    { label: 'لوحة التحكم', href: '/dashboard' },
    { label: 'المرضى', href: '/patients' },
    { label: 'المواعيد', href: '/appointments' },
    { label: 'العلاجات', href: '/treatments' },
    { label: 'الفواتير', href: '/invoices' },
    { label: 'المخزون', href: '/inventory' },
  ];

  // روابط قائمة المستخدم
  const userMenuLinks = [
    { label: 'الملف الشخصي', href: '/profile' },
    { label: 'الإعدادات', href: '/settings' },
    { label: 'تسجيل الخروج', href: '/logout' },
  ];

  // بيانات وهمية للعلاجات
  const treatments = [
    { id: 1, name: 'فحص أسنان', price: 50 },
    { id: 2, name: 'تنظيف الأسنان', price: 100 },
    { id: 3, name: 'حشو أسنان', price: 150 },
    { id: 4, name: 'علاج عصب', price: 500 },
    { id: 5, name: 'خلع سن', price: 200 },
    { id: 6, name: 'تركيب تاج', price: 800 },
    { id: 7, name: 'زراعة أسنان', price: 2000 },
  ];

  // نموذج إضافة فاتورة جديدة
  const AddInvoiceForm = () => {
    const [formData, setFormData] = useState({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      items: [{ treatmentId: '', quantity: 1, price: 0 }],
      discount: 0,
      tax: 0,
      notes: '',
    });

    const [total, setTotal] = useState(0);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleItemChange = (index, field, value) => {
      const newItems = [...formData.items];
      newItems[index][field] = value;
      
      // إذا تم تغيير العلاج، قم بتحديث السعر تلقائياً
      if (field === 'treatmentId') {
        const treatment = treatments.find(t => t.id.toString() === value);
        if (treatment) {
          newItems[index].price = treatment.price;
        }
      }
      
      setFormData({
        ...formData,
        items: newItems,
      });
      
      // حساب المجموع
      calculateTotal(newItems, formData.discount, formData.tax);
    };

    const addItem = () => {
      setFormData({
        ...formData,
        items: [...formData.items, { treatmentId: '', quantity: 1, price: 0 }],
      });
    };

    const removeItem = (index) => {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData({
        ...formData,
        items: newItems,
      });
      
      // حساب المجموع
      calculateTotal(newItems, formData.discount, formData.tax);
    };

    const calculateTotal = (items, discount, tax) => {
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = (subtotal * discount) / 100;
      const taxAmount = ((subtotal - discountAmount) * tax) / 100;
      const finalTotal = subtotal - discountAmount + taxAmount;
      setTotal(finalTotal);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      console.log('بيانات الفاتورة الجديدة:', formData);
      setShowAddInvoice(false);
    };

    return (
      <Card title="إنشاء فاتورة جديدة" className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Select
              label="المريض"
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              options={[
                { value: '', label: 'اختر المريض' },
                { value: '1', label: 'أحمد محمد' },
                { value: '2', label: 'سارة أحمد' },
                { value: '3', label: 'محمد علي' },
                { value: '4', label: 'فاطمة حسن' },
                { value: '5', label: 'خالد عبدالله' },
              ]}
            />
            <Input
              label="تاريخ الفاتورة"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">عناصر الفاتورة</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-4">
                  <Select
                    label={index === 0 ? "العلاج" : ""}
                    id={`treatment-${index}`}
                    value={item.treatmentId}
                    onChange={(e) => handleItemChange(index, 'treatmentId', e.target.value)}
                    required
                    options={[
                      { value: '', label: 'اختر العلاج' },
                      ...treatments.map(treatment => ({ value: treatment.id.toString(), label: treatment.name }))
                    ]}
                  />
                  <Input
                    label={index === 0 ? "الكمية" : ""}
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    required
                  />
                  <Input
                    label={index === 0 ? "السعر" : ""}
                    id={`price-${index}`}
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    required
                  />
                  <div className={index === 0 ? "flex items-end" : ""}>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="w-full"
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-2">
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  إضافة عنصر
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
            <Input
              label="نسبة الخصم (%)"
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
            />
            <Input
              label="نسبة الضريبة (%)"
              id="tax"
              name="tax"
              type="number"
              min="0"
              value={formData.tax}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">المجموع:</span>
              <span>{total} ريال</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setShowAddInvoice(false)} className="ml-3">
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              إنشاء الفاتورة
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  // عرض تفاصيل الفاتورة
  const InvoiceDetails = ({ invoice }) => {
    // بيانات وهمية لعناصر الفاتورة
    const invoiceItems = [
      { id: 1, treatment: 'فحص أسنان', quantity: 1, price: 50, total: 50 },
      { id: 2, treatment: 'تنظيف الأسنان', quantity: 1, price: 100, total: 100 },
      { id: 3, treatment: 'حشو أسنان', quantity: 2, price: 150, total: 300 },
    ];

    // بيانات وهمية للمدفوعات
    const payments = [
      { id: 1, date: '2023-09-15', amount: 300, method: 'نقدي' },
      { id: 2, date: '2023-09-20', amount: 150, method: 'بطاقة ائتمان' },
    ];

    return (
      <Card title={`تفاصيل الفاتورة #${invoice.id}`} className="mb-6">
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">المريض</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{invoice.patientName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">تاريخ الفاتورة</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{invoice.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">حالة الفاتورة</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{invoice.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">طريقة الدفع</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{invoice.paymentMethod}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">عناصر الفاتورة</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العلاج
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المجموع
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.treatment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.price} ريال
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.total} ريال
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-left">
                    المجموع
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.amount} ريال
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {invoice.status === 'مدفوعة جزئياً' && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">المدفوعات</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      طريقة الدفع
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.amount} ريال
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="1" className="px-6 py-4 text-sm font-medium text-gray-900 text-left">
                      إجمالي المدفوعات
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      450 ريال
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="1" className="px-6 py-4 text-sm font-medium text-gray-900 text-left">
                      المبلغ المتبقي
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      750 ريال
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setShowInvoiceDetails(false)}>
            رجوع
          </Button>
          <div className="flex space-x-2">
            <Button variant="primary" className="ml-2">طباعة الفاتورة</Button>
            {(invoice.status === 'غير مدفوعة' || invoice.status === 'مدفوعة جزئياً') && (
              <Button variant="success">تسجيل دفعة</Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // تصفية الفواتير بناءً على مصطلح البحث
  const filteredInvoices = invoices.filter(invoice => 
    invoice.patientName.includes(searchTerm) || 
    invoice.status.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        logo={<div className="text-xl font-bold text-blue-600">عيادة الأسنان</div>}
        links={navLinks}
        userMenu={userMenuLinks}
      />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">إدارة الفواتير</h1>
          <Button variant="primary" onClick={() => setShowAddInvoice(true)}>
            إنشاء فاتورة جديدة
          </Button>
        </div>
        
        {showAddInvoice && <AddInvoiceForm />}
        
        {showInvoiceDetails && selectedInvoice ? (
          <InvoiceDetails invoice={selectedInvoice} />
        ) : (
          <Card className="mb-6">
            <div className="mb-4">
              <Input
                label="بحث عن فاتورة"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم المريض أو حالة الفاتورة..."
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <Table columns={invoiceColumns} data={filteredInvoices} />
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                إجمالي الفواتير: {filteredInvoices.length}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="ml-2">السابق</Button>
                <Button variant="outline" size="sm">التالي</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

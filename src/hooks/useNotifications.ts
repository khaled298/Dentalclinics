'use client';

import { useEffect, useState } from 'react';
import { Notification } from '../../lib/models';

// مدير حالة الإشعارات والتذكيرات
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب الإشعارات للمستخدم الحالي
  const fetchNotifications = async (userId?: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // هنا نستخدم بيانات وهمية للتوضيح
      const mockNotifications: Notification[] = [
        {
          id: 1,
          user_id: userId || 1,
          title: 'تذكير بموعد',
          message: 'لديك موعد غداً الساعة 10:00 صباحاً',
          type: 'appointment_reminder',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: userId || 1,
          title: 'فاتورة مستحقة',
          message: 'لديك فاتورة مستحقة بقيمة 500 ريال',
          type: 'payment_due',
          is_read: false,
          created_at: new Date().toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('حدث خطأ أثناء جلب الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  // إنشاء إشعار جديد
  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      const newNotification: Notification = {
        ...notification,
        id: notifications.length + 1,
        created_at: new Date().toISOString()
      };
      
      setNotifications([...notifications, newNotification]);
      setError(null);
      return newNotification;
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('حدث خطأ أثناء إنشاء الإشعار');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة قراءة الإشعار
  const markAsRead = async (id: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, is_read: true } : notification
      ));
      setError(null);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('حدث خطأ أثناء تحديث حالة الإشعار');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف إشعار
  const deleteNotification = async (id: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      setNotifications(notifications.filter(notification => notification.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('حدث خطأ أثناء حذف الإشعار');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إنشاء تذكير بموعد
  const createAppointmentReminder = async (userId: number, patientId: number, appointmentDate: string, appointmentTime: string) => {
    const title = 'تذكير بموعد';
    const message = `لديك موعد في ${appointmentDate} الساعة ${appointmentTime}`;
    
    return createNotification({
      user_id: userId,
      patient_id: patientId,
      title,
      message,
      type: 'appointment_reminder',
      is_read: false
    });
  };

  // إنشاء تذكير بفاتورة مستحقة
  const createPaymentDueReminder = async (userId: number, patientId: number, invoiceId: number, amount: number) => {
    const title = 'فاتورة مستحقة';
    const message = `لديك فاتورة مستحقة بقيمة ${amount} ريال`;
    
    return createNotification({
      user_id: userId,
      patient_id: patientId,
      title,
      message,
      type: 'payment_due',
      is_read: false
    });
  };

  // إنشاء تنبيه بانخفاض المخزون
  const createInventoryAlert = async (userId: number, itemName: string, currentQuantity: number) => {
    const title = 'تنبيه المخزون';
    const message = `المخزون منخفض: ${itemName} (الكمية الحالية: ${currentQuantity})`;
    
    return createNotification({
      user_id: userId,
      title,
      message,
      type: 'inventory_alert',
      is_read: false
    });
  };

  // جلب الإشعارات غير المقروءة
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.is_read);
  };

  // جلب عدد الإشعارات غير المقروءة
  const getUnreadCount = () => {
    return getUnreadNotifications().length;
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
    createAppointmentReminder,
    createPaymentDueReminder,
    createInventoryAlert,
    getUnreadNotifications,
    getUnreadCount
  };
}

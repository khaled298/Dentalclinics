'use client';

import { useState } from 'react';

// مدير حالة خدمة الرسائل النصية
export function useSmsService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // إرسال رسالة نصية
  const sendSms = async (phoneNumber: string, message: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي لخدمة الرسائل النصية
      console.log(`إرسال رسالة نصية إلى ${phoneNumber}: ${message}`);
      
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setError(null);
      return {
        success: true,
        messageId: `sms_${Date.now()}`,
        phoneNumber,
        message
      };
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError('حدث خطأ أثناء إرسال الرسالة النصية');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إرسال تذكير بموعد عبر رسالة نصية
  const sendAppointmentReminder = async (phoneNumber: string, patientName: string, appointmentDate: string, appointmentTime: string) => {
    const message = `مرحباً ${patientName}، هذا تذكير بموعدك في عيادة الأسنان يوم ${appointmentDate} الساعة ${appointmentTime}. للإلغاء أو إعادة الجدولة، يرجى الاتصال بنا على الرقم 0123456789.`;
    return sendSms(phoneNumber, message);
  };

  // إرسال إشعار بفاتورة مستحقة عبر رسالة نصية
  const sendPaymentDueReminder = async (phoneNumber: string, patientName: string, invoiceId: number, amount: number, dueDate: string) => {
    const message = `مرحباً ${patientName}، لديك فاتورة مستحقة بقيمة ${amount} ريال (رقم الفاتورة: ${invoiceId}) يجب دفعها قبل ${dueDate}. للاستفسار، يرجى الاتصال بنا على الرقم 0123456789.`;
    return sendSms(phoneNumber, message);
  };

  // إرسال رسالة تأكيد الموعد
  const sendAppointmentConfirmation = async (phoneNumber: string, patientName: string, appointmentDate: string, appointmentTime: string) => {
    const message = `مرحباً ${patientName}، تم تأكيد موعدك في عيادة الأسنان يوم ${appointmentDate} الساعة ${appointmentTime}. نتطلع لرؤيتك!`;
    return sendSms(phoneNumber, message);
  };

  // إرسال رسالة شكر بعد الزيارة
  const sendThankYouMessage = async (phoneNumber: string, patientName: string) => {
    const message = `مرحباً ${patientName}، شكراً لزيارتك عيادة الأسنان اليوم. نتمنى لك الشفاء العاجل ونسعد بخدمتك دائماً. لأي استفسارات، يرجى الاتصال بنا على الرقم 0123456789.`;
    return sendSms(phoneNumber, message);
  };

  // إرسال رسالة تهنئة بعيد الميلاد
  const sendBirthdayWish = async (phoneNumber: string, patientName: string) => {
    const message = `مرحباً ${patientName}، عيادة الأسنان تتمنى لك عيد ميلاد سعيد! نتمنى لك عاماً مليئاً بالصحة والسعادة والابتسامات المشرقة.`;
    return sendSms(phoneNumber, message);
  };

  return {
    loading,
    error,
    sendSms,
    sendAppointmentReminder,
    sendPaymentDueReminder,
    sendAppointmentConfirmation,
    sendThankYouMessage,
    sendBirthdayWish
  };
}

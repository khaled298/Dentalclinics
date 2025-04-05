'use client';

import { useState } from 'react';

// مدير حالة روبوتات واتساب الآلية
export function useWhatsappBot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // إرسال رسالة واتساب
  const sendWhatsappMessage = async (phoneNumber: string, message: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي لخدمة واتساب
      console.log(`إرسال رسالة واتساب إلى ${phoneNumber}: ${message}`);
      
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setError(null);
      return {
        success: true,
        messageId: `whatsapp_${Date.now()}`,
        phoneNumber,
        message
      };
    } catch (err) {
      console.error('Error sending WhatsApp message:', err);
      setError('حدث خطأ أثناء إرسال رسالة واتساب');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إرسال تذكير بموعد عبر واتساب
  const sendAppointmentReminder = async (phoneNumber: string, patientName: string, appointmentDate: string, appointmentTime: string) => {
    const message = `مرحباً ${patientName}،\n\nهذا تذكير بموعدك في عيادة الأسنان يوم ${appointmentDate} الساعة ${appointmentTime}.\n\nللإلغاء أو إعادة الجدولة، يرجى الرد على هذه الرسالة أو الاتصال بنا على الرقم 0123456789.\n\nمع تحيات،\nعيادة الأسنان`;
    return sendWhatsappMessage(phoneNumber, message);
  };

  // إرسال إشعار بفاتورة مستحقة عبر واتساب
  const sendPaymentDueReminder = async (phoneNumber: string, patientName: string, invoiceId: number, amount: number, dueDate: string) => {
    const message = `مرحباً ${patientName}،\n\nلديك فاتورة مستحقة بقيمة ${amount} ريال (رقم الفاتورة: ${invoiceId}) يجب دفعها قبل ${dueDate}.\n\nيمكنك الدفع عبر الرابط التالي:\nhttps://dentalclinic.com/pay/${invoiceId}\n\nللاستفسار، يرجى الرد على هذه الرسالة أو الاتصال بنا على الرقم 0123456789.\n\nمع تحيات،\nعيادة الأسنان`;
    return sendWhatsappMessage(phoneNumber, message);
  };

  // إرسال نتائج الفحص والتوصيات عبر واتساب
  const sendExaminationResults = async (phoneNumber: string, patientName: string, doctorName: string, diagnosis: string, recommendations: string) => {
    const message = `مرحباً ${patientName}،\n\nفيما يلي نتائج فحصك مع الدكتور ${doctorName}:\n\nالتشخيص:\n${diagnosis}\n\nالتوصيات:\n${recommendations}\n\nإذا كان لديك أي استفسارات، يرجى الرد على هذه الرسالة أو الاتصال بنا على الرقم 0123456789.\n\nمع تحيات،\nعيادة الأسنان`;
    return sendWhatsappMessage(phoneNumber, message);
  };

  // إرسال استبيان رضا المريض عبر واتساب
  const sendSatisfactionSurvey = async (phoneNumber: string, patientName: string, appointmentId: number) => {
    const message = `مرحباً ${patientName}،\n\nنأمل أن تكون بصحة جيدة بعد زيارتك لعيادتنا. نود معرفة رأيك في الخدمة المقدمة.\n\nيرجى تقييم تجربتك من خلال الرابط التالي:\nhttps://dentalclinic.com/feedback/${appointmentId}\n\nشكراً لوقتك، ملاحظاتك تساعدنا على تحسين خدماتنا.\n\nمع تحيات،\nعيادة الأسنان`;
    return sendWhatsappMessage(phoneNumber, message);
  };

  // إرسال تعليمات ما بعد العلاج عبر واتساب
  const sendPostTreatmentInstructions = async (phoneNumber: string, patientName: string, treatmentType: string, instructions: string) => {
    const message = `مرحباً ${patientName}،\n\nفيما يلي تعليمات ما بعد ${treatmentType}:\n\n${instructions}\n\nإذا واجهت أي مشكلة أو كان لديك أي استفسار، يرجى الاتصال بنا فوراً على الرقم 0123456789.\n\nمع تمنياتنا لك بالشفاء العاجل،\nعيادة الأسنان`;
    return sendWhatsappMessage(phoneNumber, message);
  };

  // معالجة الردود الواردة من المرضى
  const handleIncomingMessage = async (phoneNumber: string, message: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بمنطق معالجة الرسائل الواردة
      console.log(`رسالة واردة من ${phoneNumber}: ${message}`);
      
      let response = '';
      
      // منطق بسيط للرد على الرسائل الشائعة
      if (message.includes('إلغاء') || message.includes('cancel')) {
        response = 'لإلغاء موعدك، يرجى تحديد التاريخ والوقت. سيتواصل معك أحد ممثلي خدمة العملاء قريباً.';
      } else if (message.includes('تغيير') || message.includes('reschedule')) {
        response = 'لتغيير موعدك، يرجى اقتراح تاريخ ووقت بديلين. سيتواصل معك أحد ممثلي خدمة العملاء قريباً.';
      } else if (message.includes('سعر') || message.includes('تكلفة') || message.includes('price')) {
        response = 'لمعرفة أسعار خدماتنا، يرجى زيارة موقعنا الإلكتروني: https://dentalclinic.com/prices أو الاتصال بنا على الرقم 0123456789.';
      } else {
        response = 'شكراً لتواصلك مع عيادة الأسنان. سيتم الرد على استفسارك في أقرب وقت ممكن.';
      }
      
      // إرسال الرد
      await sendWhatsappMessage(phoneNumber, response);
      
      setError(null);
      return {
        success: true,
        phoneNumber,
        originalMessage: message,
        response
      };
    } catch (err) {
      console.error('Error handling incoming WhatsApp message:', err);
      setError('حدث خطأ أثناء معالجة رسالة واتساب الواردة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendWhatsappMessage,
    sendAppointmentReminder,
    sendPaymentDueReminder,
    sendExaminationResults,
    sendSatisfactionSurvey,
    sendPostTreatmentInstructions,
    handleIncomingMessage
  };
}

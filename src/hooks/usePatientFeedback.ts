'use client';

import { useState } from 'react';
import { PatientFeedback } from '../../lib/models';

// مدير حالة تقييمات وملاحظات المرضى
export function usePatientFeedback() {
  const [feedbacks, setFeedbacks] = useState<PatientFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب تقييمات المرضى
  const fetchFeedbacks = async (patientId?: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // هنا نستخدم بيانات وهمية للتوضيح
      const mockFeedbacks: PatientFeedback[] = [
        {
          id: 1,
          patient_id: patientId || 1,
          appointment_id: 101,
          rating: 5,
          comment: 'خدمة ممتازة وطاقم طبي محترف',
          created_at: '2023-09-15T10:30:00Z'
        },
        {
          id: 2,
          patient_id: patientId || 2,
          appointment_id: 102,
          rating: 4,
          comment: 'تجربة جيدة، ولكن وقت الانتظار كان طويلاً',
          created_at: '2023-09-10T14:15:00Z'
        }
      ];
      
      setFeedbacks(mockFeedbacks);
      setError(null);
      return mockFeedbacks;
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('حدث خطأ أثناء جلب تقييمات المرضى');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إضافة تقييم جديد
  const addFeedback = async (feedback: Omit<PatientFeedback, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      const newFeedback: PatientFeedback = {
        ...feedback,
        id: feedbacks.length + 1,
        created_at: new Date().toISOString()
      };
      
      setFeedbacks([...feedbacks, newFeedback]);
      setError(null);
      return newFeedback;
    } catch (err) {
      console.error('Error adding feedback:', err);
      setError('حدث خطأ أثناء إضافة التقييم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف تقييم
  const deleteFeedback = async (id: number) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('حدث خطأ أثناء حذف التقييم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إنشاء استبيان رضا المريض
  const createSatisfactionSurvey = async (patientId: number, appointmentId: number, doctorName: string) => {
    // في الإصدار النهائي، سيتم إنشاء استبيان في قاعدة البيانات وإرسال رابط للمريض
    const surveyUrl = `https://dentalclinic.com/survey/${appointmentId}`;
    
    return {
      surveyId: `survey_${Date.now()}`,
      patientId,
      appointmentId,
      doctorName,
      surveyUrl
    };
  };

  // حساب متوسط التقييمات
  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    
    const sum = feedbacks.reduce((total, feedback) => total + feedback.rating, 0);
    return sum / feedbacks.length;
  };

  // الحصول على توزيع التقييمات (عدد التقييمات لكل درجة)
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    feedbacks.forEach(feedback => {
      distribution[feedback.rating as keyof typeof distribution]++;
    });
    
    return distribution;
  };

  // إنشاء رمز QR للتقييم
  const generateFeedbackQRCode = (appointmentId: number) => {
    // في الإصدار النهائي، سيتم إنشاء رمز QR حقيقي
    const qrCodeUrl = `https://dentalclinic.com/qr/feedback/${appointmentId}`;
    
    return {
      appointmentId,
      qrCodeUrl
    };
  };

  // إنشاء برنامج مكافآت بناءً على التقييمات
  const createRewardsProgram = (patientId: number, feedbackCount: number) => {
    // منطق بسيط لبرنامج المكافآت
    let rewardPoints = 0;
    let rewardTier = 'عادي';
    
    if (feedbackCount >= 5) {
      rewardPoints = feedbackCount * 10;
      rewardTier = 'فضي';
    }
    
    if (feedbackCount >= 10) {
      rewardPoints = feedbackCount * 15;
      rewardTier = 'ذهبي';
    }
    
    if (feedbackCount >= 20) {
      rewardPoints = feedbackCount * 20;
      rewardTier = 'ماسي';
    }
    
    return {
      patientId,
      feedbackCount,
      rewardPoints,
      rewardTier
    };
  };

  return {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    addFeedback,
    deleteFeedback,
    createSatisfactionSurvey,
    calculateAverageRating,
    getRatingDistribution,
    generateFeedbackQRCode,
    createRewardsProgram
  };
}

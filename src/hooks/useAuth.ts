'use client';

import { useEffect, useState } from 'react';
import { User } from '../../lib/models';

// مدير حالة المصادقة والمستخدمين
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // التحقق من حالة المصادقة عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي للتحقق من المصادقة
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setError(null);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setUser(null);
        setIsAuthenticated(false);
        setError('حدث خطأ أثناء التحقق من المصادقة');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // تسجيل الدخول
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي لتسجيل الدخول
      if (username === 'admin' && password === 'admin') {
        const userData: User = {
          id: 1,
          username: 'admin',
          full_name: 'مدير النظام',
          email: 'admin@dentalclinic.com',
          role: 'admin',
          is_active: true
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
        return userData;
      } else {
        throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      console.error('Login error:', err);
      setUser(null);
      setIsAuthenticated(false);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // التحقق من صلاحيات المستخدم
  const hasPermission = (requiredRole: string | string[]) => {
    if (!isAuthenticated || !user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole || user.role === 'admin';
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    hasPermission
  };
}

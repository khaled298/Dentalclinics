'use client';

import React, { useState } from 'react';
import { Button, Input, Alert, Spinner } from '../../components/ui';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        // تسجيل الدخول بنجاح، التوجيه إلى لوحة التحكم
        window.location.href = '/dashboard';
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          نظام إدارة عيادة الأسنان
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          تسجيل الدخول إلى حسابك
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4">
              <Alert type="error">{error}</Alert>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="اسم المستخدم"
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              dir="rtl"
            />

            <Input
              label="كلمة المرور"
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              dir="rtl"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="mr-2 block text-sm text-gray-900">
                  تذكرني
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

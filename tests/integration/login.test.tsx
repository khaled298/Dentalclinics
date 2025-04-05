import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../src/app/login/page';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock useAuth hook
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockImplementation((email, password) => {
      if (email === 'admin@dental.com' && password === 'password123') {
        return Promise.resolve({ success: true });
      } else {
        return Promise.reject(new Error('بيانات الدخول غير صحيحة'));
      }
    }),
    loading: false,
    error: null,
  }),
}));

describe('Login Page Integration Test', () => {
  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('تسجيل الدخول')).toBeInTheDocument();
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'تسجيل الدخول' })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(<LoginPage />);
    
    const loginButton = screen.getByRole('button', { name: 'تسجيل الدخول' });
    
    // Try to submit empty form
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('البريد الإلكتروني مطلوب')).toBeInTheDocument();
      expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument();
    });
    
    // Fill email only
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'admin@dental.com' },
    });
    
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.queryByText('البريد الإلكتروني مطلوب')).not.toBeInTheDocument();
      expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument();
    });
    
    // Fill invalid email
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('البريد الإلكتروني غير صالح')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const { useAuth } = require('../../src/hooks/useAuth');
    const { useRouter } = require('next/navigation');
    
    render(<LoginPage />);
    
    // Fill form with valid credentials
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'admin@dental.com' },
    });
    
    fireEvent.change(screen.getByLabelText('كلمة المرور'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));
    
    await waitFor(() => {
      expect(useAuth().login).toHaveBeenCalledWith('admin@dental.com', 'password123');
      expect(useRouter().push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles failed login', async () => {
    render(<LoginPage />);
    
    // Fill form with invalid credentials
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'wrong@dental.com' },
    });
    
    fireEvent.change(screen.getByLabelText('كلمة المرور'), {
      target: { value: 'wrongpassword' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));
    
    await waitFor(() => {
      expect(screen.getByText('بيانات الدخول غير صحيحة')).toBeInTheDocument();
    });
  });
});

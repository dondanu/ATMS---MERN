import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarClock, Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await resetPassword(email);
      
      if (result) {
        setSuccess(true);
      } else {
        setError('Email not found. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center">
            <CalendarClock size={48} className="text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        {success ? (
          <div className="mt-8 space-y-6">
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md flex items-start">
              <CheckCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Password reset link sent!</p>
                <p className="text-sm mt-1">
                  We've sent a password reset link to <span className="font-medium">{email}</span>. 
                  Please check your email and follow the instructions to reset your password.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/login" className="btn btn-primary inline-flex items-center">
                <ArrowLeft size={18} className="mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter your email address"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send a password reset link to this email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
            
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to login
              </Link>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>For demo purposes, use:</p>
              <p className="font-medium">admin@example.com</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
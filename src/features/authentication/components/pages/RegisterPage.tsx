import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../hooks/useAuthMutations';
import { PublicRoute } from '../PublicRoute';
import RegisterForm from '../forms/RegisterForm';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const registerMutation = useRegisterMutation();
  const mutateAsync = registerMutation.mutate;
  const isLoading = registerMutation.isPending;
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (formData: { 
    fullName: string; 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string;
  }) => {
    try {
      await mutateAsync(formData);
      navigate('/login', { state: { registered: true } });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <PublicRoute redirectTo="/dashboard">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
            <p className="text-gray-600 mt-2">Join us today to get started</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </div>
      </div>
    </PublicRoute>
  );
};

export default RegisterPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../hooks/useAuthMutations';
import { PublicRoute } from '../PublicRoute';
import RegisterForm from '../forms/RegisterForm';
import styles from '../auth.module.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
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
      setError(null);
      await registerMutation.mutateAsync(formData);
      navigate('/login', { state: { registered: true } });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'فشل إنشاء الحساب. حاول مرة أخرى.';
      setError(errorMessage);
    }
  };

  return (
    <PublicRoute redirectTo="/dashboard">
      <div className={styles.authPage}>
        {/* Logo Header */}
        <div className={styles.logoHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="225" height="101" viewBox="0 0 225 101" fill="none">
            <g clipPath="url(#clip0_reg)">
              <path d="M118.452 21.9545V43.1261H115.338H112.225V30.6722V18.2184H102.137C87.1924 18.2184 87.3169 18.0938 87.3169 34.4084V48.1077H107.866H128.415V24.4453V0.78294H123.433H118.452V21.9545ZM102.013 33.0385C102.262 40.5108 101.888 43.8733 100.767 44.496C97.5291 46.4887 96.0346 43.0016 96.0346 33.163C96.0346 23.1999 96.5328 21.5809 99.7708 22.2036C101.265 22.5772 101.763 24.8189 102.013 33.0385Z" fill="#F04930" />
              <path d="M134.642 24.4453V48.1077H163.909H193.3L192.926 33.4121L192.553 18.8411H187.571H182.59L182.216 30.9213C181.967 40.6353 181.469 43.1261 180.099 43.1261C178.604 43.1261 178.231 40.7599 178.231 30.6722V18.2184H173.249H168.268V30.6722C168.268 42.2543 168.143 43.1261 165.777 43.1261C163.535 43.1261 163.286 42.1298 163.037 30.9213L162.663 18.8411L158.055 18.4674L153.323 18.0938V30.6722V43.2507L149.338 42.877L145.228 42.5034L144.979 32.5403C144.854 27.0606 144.73 17.7202 144.73 11.6178L144.605 0.78294H139.624H134.642V24.4453Z" fill="#F04930" />
              <path d="M19.4435 9.25151C-1.35444 19.0901 -6.33599 42.2543 8.73319 59.3161L12.5939 63.675L14.8356 60.686C17.2018 57.6971 17.2018 57.6971 13.4657 51.7192C10.2277 46.3641 9.85404 44.9941 10.3522 37.6464C10.7258 30.9213 11.473 28.6796 14.7111 24.8189C18.8208 19.7128 23.6778 16.3502 29.033 15.1048L32.5201 14.2331L32.7692 48.8548L33.1428 83.6012H36.2563C39.8679 83.6012 39.7433 84.8465 39.8679 40.8844L39.9924 14.3576L45.3476 15.1048C49.4574 15.603 51.2009 15.2294 53.6917 13.3613C56.0579 11.4932 56.4315 10.4969 55.4352 9.5006C53.1935 7.2589 45.223 5.88897 35.6336 5.76443C28.6594 5.76443 25.4214 6.51166 19.4435 9.25151Z" fill="#00549A" />
              <path d="M83.9547 8.25526C73.4934 11.9914 61.0396 19.0901 53.9409 25.1925C47.8385 30.5477 47.4648 31.1704 47.4648 36.6501L47.5894 42.5034L50.2047 38.7673C54.9372 32.0422 69.1346 18.7165 75.3615 15.1049C78.7241 13.1123 84.8265 10.2479 89.0608 8.75342C93.7933 6.88533 95.5368 5.88903 93.5442 5.88903C91.8006 5.88903 87.5663 7.00988 83.9547 8.25526Z" fill="#F04930" />
            </g>
            <defs>
              <clipPath id="clip0_reg">
                <rect width="225" height="100.461" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h1 className={styles.logoTitle}>جمعية رسالة</h1>
          <p className={styles.logoSubtitle}>فرع الزقازيق</p>
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>إنشاء حساب جديد</h2>
          <p className={styles.formSubtitle}>أنشئ حسابك للانضمام إلى المنصة</p>

          {error && (
            <div className={styles.errorMessage}>
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
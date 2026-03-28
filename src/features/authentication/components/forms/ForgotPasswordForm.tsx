import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from '../auth.module.css';

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (data: { email: string }) => void;
  isLoading?: boolean;
  successMessage?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
  successMessage
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    onSubmit({
      email: data.email,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {/* Email Field */}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>
          البريد الإلكتروني
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="email"
            type="email"
            className={`${styles.formInput} ${errors.email ? styles.hasError : ''}`}
            placeholder="أدخل البريد الإلكتروني"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className={styles.fieldError}>{errors.email.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading || !!successMessage}
      >
        {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
      </button>

      {/* Back to Login */}
      <Link to="/login" className={styles.backLink}>
        <ArrowRight size={16} />
        العودة إلى تسجيل الدخول
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
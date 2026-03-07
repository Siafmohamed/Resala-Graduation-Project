import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../auth.module.css';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
  successMessage?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
  successMessage,
}) => {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* New Password Field */}
      <div className={styles.formGroup}>
        <label htmlFor="newPassword" className={styles.formLabel}>
          كلمة المرور الجديدة
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            className={`${styles.formInput} ${errors.newPassword ? styles.hasError : ''}`}
            placeholder="أدخل كلمة المرور الجديدة"
            {...register('newPassword')}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowNewPassword(!showNewPassword)}
            tabIndex={-1}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className={styles.fieldError}>{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.formLabel}>
          تأكيد كلمة المرور
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            className={`${styles.formInput} ${errors.confirmPassword ? styles.hasError : ''}`}
            placeholder="أعد كتابة كلمة المرور"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className={styles.fieldError}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading}
      >
        {isLoading ? 'جاري تغيير كلمة المرور...' : 'تغيير كلمة المرور'}
      </button>

      {/* Back to Login */}
      <Link to="/login" className={styles.forgotLink}>
        العودة إلى تسجيل الدخول
      </Link>
    </form>
  );
};

export default ResetPasswordForm;
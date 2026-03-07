import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../auth.module.css';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'اسم المستخدم مطلوب' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Username Field */}
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.formLabel}>
          اسم المستخدم
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="username"
            type="text"
            className={`${styles.formInput} ${errors.username ? styles.hasError : ''}`}
            placeholder="أدخل اسم المستخدم"
            {...register('username')}
          />
        </div>
        {errors.username && (
          <p className={styles.fieldError}>{errors.username.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.formLabel}>
          كلمة المرور
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`${styles.formInput} ${errors.password ? styles.hasError : ''}`}
            placeholder="••••••••"
            {...register('password')}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className={styles.fieldError}>{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading}
      >
        {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>

      {/* Forgot Password Link */}
      <Link to="/forgot-password" className={styles.forgotLink}>
        نسيت كلمة المرور؟
      </Link>
    </form>
  );
};

export default LoginForm;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from'zod';
import { useCreateStaffMutation } from '../../index';
import styles from '../auth.module.css';

const staffSchema = z.object({
 name: z.string().min(1, { message: 'الاسم مطلوب' }),
 username: z.string().min(1, { message: 'اسم المستخدم مطلوب' }).refine((val) => !val.includes(' '), {
    message: 'اسم المستخدم يجب أن لا يحتوي على مسافات',
  }),
 email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }).optional().or(z.literal('')),
 phoneNumber: z.string().optional().or(z.literal('')),
 password: z.string().min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }),
 staffType: z.enum(['1', '2'], {
   message: 'نوع الموظف يجب أن يكون 1 أو 2',
  }),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface CreateStaffFormProps {
 token: string;
 onSuccess?: () => void;
}

interface SuccessData {
 staffId: number;
 username: string;
}

const CreateStaffForm: React.FC<CreateStaffFormProps> = ({ token, onSuccess }) => {
 const [successData, setSuccessData] = useState<SuccessData | null>(null);
 const [error, setError] = useState<string | null>(null);
 
 const createStaffMutation = useCreateStaffMutation();
 const isLoading = createStaffMutation.isPending;

const {
  register,
   handleSubmit,
   formState: { errors },
  reset,
 } = useForm<StaffFormData>({
  resolver: zodResolver(staffSchema),
 });

const onSubmit = async (data: StaffFormData) => {
   try {
    setError(null);
    setSuccessData(null);

      // Convert staffType to number
    const payload = {
       ...data,
       staffType: parseInt(data.staffType) as 1 | 2,
      email: data.email || undefined,
       phoneNumber: data.phoneNumber || undefined,
     };

    const response = await createStaffMutation.mutateAsync({
       ...payload,
       token,
     });

      if (!response.succeeded) {
      // Show field-level errors if present
      if (response.errors) {
       const firstField = Object.keys(response.errors)[0];
       const firstMessage = response.errors[firstField]?.[0] || response.message;
       setError(firstMessage || 'خطأ غير معروف');
      } else {
      setError(response.message || 'فشل إنشاء الحساب');
      }
     return;
     }

      // Show success with staffId and username
    setSuccessData(response.data);
     
      // Reset form
    reset();
     
      // Call optional success callback
     onSuccess?.();
   } catch (err: unknown) {
  const axiosError = err as { response?: { status: number; data?: { message?: string; errors?: Record<string, string[]> } } };
   const status = axiosError.response?.status;
   const responseData = axiosError.response?.data;

      if (status === 400) {
      if (responseData?.errors) {
       const firstField = Object.keys(responseData.errors)[0];
       const firstMessage = responseData.errors[firstField]?.[0] || responseData.message;
       setError(firstMessage || 'خطأ غير معروف');
      } else {
      setError(responseData?.message || 'بيانات غير صحيحة');
      }
     } else if (status === 401) {
     setError('Session expired. Please log in again.');
     } else if (status === 403) {
     setError('You do not have permission to create accounts.');
     } else if (status === 409) {
     setError('This username is already taken. Please choose a different one.');
     } else {
     const errorMessage = responseData?.message || 'Connection failed. Please check your network.';
     setError(errorMessage);
     }
   }
 };

 return (
   <div className={styles.formCard}>
     <h2 className={styles.formTitle}>إنشاء حساب موظف</h2>
     
      {successData && (
       <div className={styles.successMessage} style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
         <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>تم إنشاء الحساب بنجاح!</p>
         <p style={{ margin: 0 }}>
           <strong>المعرف:</strong> {successData.staffId} | <strong>اسم المستخدم:</strong> {successData.username}
         </p>
       </div>
     )}

      {error && (
       <div className={styles.errorMessage}>
         {error}
       </div>
     )}

     <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
       <div className={styles.formGroup}>
         <label htmlFor="name" className={styles.formLabel}>
           الاسم <span style={{ color: 'red' }}>*</span>
         </label>
         <input
          id="name"
           type="text"
          className={`${styles.formInput} ${errors.name ? styles.hasError: ''}`}
           placeholder="أدخل الاسم"
           {...register('name')}
         />
         {errors.name && (
           <p className={styles.fieldError}>{errors.name.message}</p>
         )}
       </div>

        {/* Username Field */}
       <div className={styles.formGroup}>
         <label htmlFor="username" className={styles.formLabel}>
           اسم المستخدم <span style={{ color: 'red' }}>*</span>
         </label>
         <input
          id="username"
           type="text"
          className={`${styles.formInput} ${errors.username ? styles.hasError: ''}`}
           placeholder="أدخل اسم المستخدم"
           {...register('username')}
         />
         {errors.username && (
           <p className={styles.fieldError}>{errors.username.message}</p>
         )}
       </div>

        {/* Email Field */}
       <div className={styles.formGroup}>
         <label htmlFor="email" className={styles.formLabel}>
           البريد الإلكتروني
         </label>
         <input
          id="email"
           type="email"
          className={`${styles.formInput} ${errors.email ? styles.hasError: ''}`}
           placeholder="example@resala.org"
           {...register('email')}
         />
         {errors.email && (
           <p className={styles.fieldError}>{errors.email.message}</p>
         )}
       </div>

        {/* Phone Number Field */}
       <div className={styles.formGroup}>
         <label htmlFor="phoneNumber" className={styles.formLabel}>
           رقم الهاتف
         </label>
         <input
          id="phoneNumber"
           type="tel"
          className={`${styles.formInput} ${errors.phoneNumber ? styles.hasError: ''}`}
           placeholder="01xxxxxxxxx"
           {...register('phoneNumber')}
         />
         {errors.phoneNumber && (
           <p className={styles.fieldError}>{errors.phoneNumber.message}</p>
         )}
       </div>

        {/* Password Field */}
       <div className={styles.formGroup}>
         <label htmlFor="password" className={styles.formLabel}>
           كلمة المرور <span style={{ color: 'red' }}>*</span>
         </label>
         <input
          id="password"
           type="password"
          className={`${styles.formInput} ${errors.password ? styles.hasError: ''}`}
           placeholder="••••••••"
           {...register('password')}
         />
         {errors.password && (
           <p className={styles.fieldError}>{errors.password.message}</p>
         )}
       </div>

        {/* Staff Type Field */}
       <div className={styles.formGroup}>
         <label htmlFor="staffType" className={styles.formLabel}>
           نوع الموظف <span style={{ color: 'red' }}>*</span>
         </label>
         <select
          id="staffType"
          className={`${styles.formInput} ${errors.staffType ? styles.hasError: ''}`}
           {...register('staffType')}
         >
           <option value="">اختر النوع</option>
           <option value="1">مدير (Admin)</option>
           <option value="2">موظف استقبال (Reception)</option>
         </select>
         {errors.staffType && (
           <p className={styles.fieldError}>{errors.staffType.message}</p>
         )}
       </div>

        {/* Submit Button */}
       <button
         type="submit"
        className={styles.submitBtn}
         disabled={isLoading}
       >
         {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
       </button>
     </form>
   </div>
 );
};

export default CreateStaffForm;

import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from '../auth.module.css';

interface OTPFormProps {
    onSubmit: (otp: string) => void;
    isLoading?: boolean;
    otpLength?: number;
}

const OTPForm: React.FC<OTPFormProps> = ({ onSubmit, isLoading = false, otpLength = 6 }) => {
    const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
    const [resendTimer, setResendTimer] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = useCallback((index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < otpLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [otp, otpLength]);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [otp]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength);
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);
        const nextEmptyIndex = Math.min(pastedData.length, otpLength - 1);
        inputRefs.current[nextEmptyIndex]?.focus();
    }, [otp, otpLength]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === otpLength) {
            onSubmit(otpString);
        }
    };

    const handleResend = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div className={styles.otpContainer} onPaste={handlePaste}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        className={`${styles.otpInput} ${digit ? styles.filled : ''}`}
                        autoFocus={index === 0}
                    />
                ))}
            </div>

            {/* Resend */}
            <div className={styles.resendRow}>
                <span className={styles.resendText}>لم تستلم الرمز؟ </span>
                <button
                    type="button"
                    className={styles.resendBtn}
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                >
                    {resendTimer > 0 ? `إعادة الإرسال (${resendTimer})` : 'إعادة الإرسال'}
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading || !isComplete}
            >
                {isLoading ? 'جاري التحقق...' : 'تأكيد'}
            </button>

            {/* Back to Login */}
            <Link to="/login" className={styles.backLink}>
                <ArrowRight size={16} />
                العودة إلى تسجيل الدخول
            </Link>
        </form>
    );
};

export default OTPForm;

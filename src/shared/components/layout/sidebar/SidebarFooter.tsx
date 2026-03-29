import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/authentication';
import { authService } from '@/features/authentication/services/authService';
import styles from './sidebar.module.css';

const SidebarFooter: React.FC = () => {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((s: any) => s.clearAuth);
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore error on logout
        }
        // Clear all auth state and force a full page reload to clear memory caches
        clearAuth();
        queryClient.clear();
        window.location.href = '/login';
    };

    return (
        <div className={styles.sidebarFooter}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
                <span>تسجيل الخروج</span>
                <LogOut size={20} className={styles.logoutIcon} />
            </button>
        </div>
    );
};

export default SidebarFooter;

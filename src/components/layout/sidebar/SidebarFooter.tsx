import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/features/authentication';
import styles from './sidebar.module.css';

const SidebarFooter: React.FC = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
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

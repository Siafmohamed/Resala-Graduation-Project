import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './sidebar.module.css';

const SidebarFooter: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth state and redirect to login
        navigate('/login');
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

import React from 'react';
import { Bell } from 'lucide-react';
import styles from './layout.module.css';

interface HeaderProps {
    pageTitle?: string;
    pageSubtitle?: string;
    userName?: string;
    userRole?: string;
}

const Header: React.FC<HeaderProps> = ({
    pageTitle = 'لوحة استقبال الفرع',
    pageSubtitle = 'إدارة المتبرعين وتأكيد عمليات الدفع',
    userName = '',
    userRole = '',
}) => {
    const displayName = userName || 'مستخدم';
    const displayRole = userRole || '—';
    const avatarLetter = displayName.charAt(0);

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                {/* Right side - Page title */}
                <div className={styles.headerRight}>
                    <h1 className={styles.headerPageTitle}>{pageTitle}</h1>
                    <p className={styles.headerPageSubtitle}>{pageSubtitle}</p>
                </div>

                {/* Left side - User info */}
                <div className={styles.headerLeft}>
                    <button className={styles.notificationBtn}>
                        <Bell size={18} />
                    </button>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{displayName}</span>
                        <span className={styles.userRole}>{displayRole}</span>
                    </div>
                    <div className={styles.userAvatar}>
                        {avatarLetter}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

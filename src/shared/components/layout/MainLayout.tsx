import React from 'react';
import { Outlet } from 'react-router-dom';
import { useCurrentUser, ROLE_LABELS_AR } from '@/features/authentication';
import type { Role } from '@/features/authentication/types/role.types';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import styles from './layout.module.css';

interface MainLayoutProps {
    pageTitle?: string;
    pageSubtitle?: string;
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    pageTitle,
    pageSubtitle,
    children,
}) => {
    const user = useCurrentUser();
    const userName = user?.fullName ?? '';
    const userRole = user?.role != null ? ROLE_LABELS_AR[user.role as Role] : '';

    return (
        <div className={styles.layoutWrapper}>
            {/* Sidebar on the right (RTL) */}
            <Sidebar />

            {/* Main content area */}
            <div className={styles.mainArea}>
                <Header
                    pageTitle={pageTitle}
                    pageSubtitle={pageSubtitle}
                    userName={userName}
                    userRole={userRole}
                />
                <main className={styles.pageContent}>
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

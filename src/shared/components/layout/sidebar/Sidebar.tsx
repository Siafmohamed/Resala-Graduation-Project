import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';
import styles from './sidebar.module.css';

const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <SidebarHeader />
            <SidebarNav />
            <SidebarFooter />
        </aside>
    );
};

export default Sidebar;

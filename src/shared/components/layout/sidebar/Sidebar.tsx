import React from 'react';
import SidebarNav from './SidebarNav';

const Sidebar: React.FC = () => {
    return (
        <aside className="h-screen sticky top-0 border-l border-gray-100 bg-white">
            <SidebarNav />
        </aside>
    );
};

export default Sidebar;

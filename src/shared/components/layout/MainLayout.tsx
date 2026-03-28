import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import { PAGE_METADATA } from './pageMetadata';

interface MainLayoutProps {
    pageTitle?: string;
    pageSubtitle?: string;
    children?: React.ReactNode;
}

export const LayoutContext = React.createContext<{
    setHeader: (title: string, subtitle: string) => void;
}>({
    setHeader: () => {},
});

const MainLayout: React.FC<MainLayoutProps> = ({
    pageTitle: initialTitle,
    pageSubtitle: initialSubtitle,
    children,
}) => {
    const location = useLocation();
    const [title, setTitle] = useState(initialTitle || "");
    const [subtitle, setSubtitle] = useState(initialSubtitle || "");

    useEffect(() => {
        // Find matching metadata for the current path
        // Handle dynamic routes like /donors/:id by checking if the path starts with a known prefix
        const currentPath = location.pathname;
        let metadata = PAGE_METADATA[currentPath];

        if (!metadata) {
            // Fallback for dynamic routes
            const baseRoute = Object.keys(PAGE_METADATA).find(route => currentPath.startsWith(route + '/'));
            if (baseRoute) {
                metadata = PAGE_METADATA[baseRoute];
            }
        }

        if (metadata) {
            setTitle(metadata.title);
            setSubtitle(metadata.subtitle);
        } else if (!initialTitle && !initialSubtitle) {
            // Default fallback if no metadata is found and no initial props were provided
            setTitle('لوحة التحكم');
            setSubtitle('نظرة شاملة على أداء الجمعية');
        }
    }, [location.pathname, initialTitle, initialSubtitle]);

    const setHeader = (newTitle: string, newSubtitle: string) => {
        setTitle(newTitle);
        setSubtitle(newSubtitle);
    };

    return (
        <LayoutContext.Provider value={{ setHeader }}>
            <div className="flex min-h-screen w-full bg-[#f8fafc]" dir="rtl">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content area */}
                <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                    <Header 
                        pageTitle={title} 
                        pageSubtitle={subtitle} 
                    />
                    <main className="flex-1 overflow-y-auto">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </LayoutContext.Provider>
    );
};

export default MainLayout;

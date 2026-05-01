import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import { PAGE_METADATA } from './pageMetadata';
import { useAuthStore, useIsInitialized, useIsAuthenticated } from '@/features/authentication';
import { FullPageSpinner } from '@/features/authentication/components/FullPageSpinner';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Strict role/auth check at the layout level
    const isInitialized = useIsInitialized();
    const isAuthenticated = useIsAuthenticated();
    const userRole = useAuthStore((s: any) => s.userRole);

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

    // Close sidebar on location change for mobile screens
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const setHeader = (newTitle: string, newSubtitle: string) => {
        setTitle(newTitle);
        setSubtitle(newSubtitle);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // If not initialized, show spinner
    if (!isInitialized) {
        return <FullPageSpinner />;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // If no role is set, something is wrong with the session
    if (!userRole) {
        console.error('[MainLayout] Authenticated user has no role.');
        return <Navigate to="/login" replace />;
    }

    return (
        <LayoutContext.Provider value={{ setHeader }}>
            <div className="flex min-h-screen w-full bg-[#f8fafc]" dir="rtl">
                {/* Mobile overlay backdrop */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Main content area */}
                <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden min-w-0 w-full">
                    <Header 
                        pageTitle={title} 
                        pageSubtitle={subtitle} 
                        toggleSidebar={toggleSidebar}
                    />
                    <main className="flex-1 overflow-y-auto px-4 md:px-0 pb-10">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </LayoutContext.Provider>
    );
};

export default MainLayout;

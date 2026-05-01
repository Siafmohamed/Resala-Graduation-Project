import React from 'react';
import SidebarNav from './SidebarNav';
import { X } from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, setIsOpen }) => {
    return (
        <aside 
            className={`
                fixed inset-y-0 right-0 z-50 w-[280px] bg-white border-l border-gray-100 h-screen transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
        >
            <div className="relative h-full w-full flex flex-col">
                {/* Mobile close button */}
                <button 
                    type="button"
                    className="absolute top-6 left-6 p-2 rounded-lg bg-gray-50 text-gray-500 lg:hidden z-10 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen?.(false)}
                >
                    <X size={20} />
                </button>
                
                {/* SidebarNav handles its own scrolling inside ScrollArea */}
                <SidebarNav />
            </div>
        </aside>
    );
};

export default Sidebar;

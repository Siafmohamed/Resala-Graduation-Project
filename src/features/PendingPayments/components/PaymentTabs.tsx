import React from 'react';
import type { PaymentMethod } from '../types/pendingPayments.types';
import { 
  LayoutGrid, 
  User, 
  Building2, 
  Smartphone, 
  Zap 
} from 'lucide-react';

interface PaymentTabsProps {
  activeTab: PaymentMethod;
  onTabChange: (tab: PaymentMethod) => void;
  counts?: Record<PaymentMethod, number>;
}

const tabs: { id: PaymentMethod; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'All', label: 'الكل', icon: LayoutGrid, color: 'blue' },
  { id: 'Representatives', label: 'مندوبين', icon: User, color: 'green' },
  { id: 'Branch', label: 'فرع', icon: Building2, color: 'indigo' },
  { id: 'Vodafone Cash', label: 'فودافون كاش', icon: Smartphone, color: 'red' },
  { id: 'InstaPay', label: 'انستا باي', icon: Zap, color: 'purple' },
];

const PaymentTabs: React.FC<PaymentTabsProps> = ({ activeTab, onTabChange, counts }) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-50/50 rounded-2xl border border-gray-100 mb-6 mx-6 mt-6" dir="rtl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold font-[Cairo] transition-all duration-200
              ${isActive 
                ? 'bg-white text-[#00549A] shadow-sm ring-1 ring-gray-100' 
                : 'text-[#697282] hover:bg-white/50 hover:text-[#495565]'
              }
            `}
          >
            <Icon size={18} className={isActive ? 'text-[#00549A]' : 'text-[#94a3b8]'} />
            <span>{tab.label}</span>
            {counts && counts[tab.id] !== undefined && (
              <span className={`
                ml-1 px-2 py-0.5 rounded-full text-[10px]
                ${isActive ? 'bg-[#e6eff7] text-[#00549A]' : 'bg-gray-100 text-[#94a3b8]'}
              `}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PaymentTabs;

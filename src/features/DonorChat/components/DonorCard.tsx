import React from 'react';
import type { DonorListItem } from '../types/donor';

interface DonorCardProps {
  donor: DonorListItem;
  isActive?: boolean;
  onClick: () => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({ donor, isActive, onClick }) => {
  const firstLetter = donor.fullName[0]?.toUpperCase() || '?';

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 cursor-pointer transition-colors
        ${isActive ? 'bg-blue-100 border-r-4 border-blue-700' : 'hover:bg-blue-50'}
        border-b border-blue-200
        ${donor.unreadCount && donor.unreadCount > 0 ? 'bg-blue-50' : ''}
      `}
    >
      <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-lg relative">
        {firstLetter}
        {donor.unreadCount && donor.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {donor.unreadCount}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{donor.fullName}</p>
        <p className="text-sm text-gray-500 truncate">{donor.phoneNumber}</p>
        {donor.email && <p className="text-xs text-gray-400 truncate">{donor.email}</p>}
      </div>
    </div>
  );
};

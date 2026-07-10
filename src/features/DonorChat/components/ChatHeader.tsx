import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { DonorListItem } from '../types/donor';

interface ChatHeaderProps {
  donor: DonorListItem;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  onReconnect?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ donor, connectionStatus, onReconnect }) => {
  const firstLetter = donor.fullName[0]?.toUpperCase() || '?';

  return (
    <div className="p-4 bg-white border-b border-blue-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-lg">
          {firstLetter}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">{donor.fullName}</h2>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
            </span>
          </div>
          <p className="text-sm text-gray-500">{donor.phoneNumber}</p>
        </div>
        {connectionStatus === 'connecting' && <Loader2 className="text-blue-700 animate-spin" />}
        {connectionStatus === 'disconnected' && onReconnect && (
          <Button onClick={onReconnect} variant="outline" className="flex items-center gap-2">
            <RefreshCw size={16} />
            إعادة الاتصال
          </Button>
        )}
      </div>
      {connectionStatus === 'disconnected' && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
          انقطع الاتصال — إعادة المحاولة...
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ArrowRight, Loader2, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { SupportChatUser } from '../types/support';
import type { ConnectionStatus } from '../services/supportSignalR';

interface SupportChatHeaderProps {
  user?: SupportChatUser;
  connectionStatus: ConnectionStatus;
  onReconnect?: () => void;
  onBack?: () => void;
}

export const SupportChatHeader: React.FC<SupportChatHeaderProps> = ({
  user,
  connectionStatus,
  onReconnect,
  onBack,
}) => {
  const firstLetter = user?.name[0]?.toUpperCase() || '?';

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-emerald-500';
      case 'connecting':
      case 'reconnecting':
        return 'bg-amber-400';
      case 'disconnected':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'متصل الآن';
      case 'connecting':
        return 'جاري الاتصال...';
      case 'reconnecting':
        return 'إعادة الاتصال...';
      case 'disconnected':
        return 'غير متصل';
      case 'error':
        return 'خطأ في الاتصال';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 md:px-6 py-4 bg-white border-b border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden p-2 -mr-1 rounded-xl hover:bg-gray-100 text-[#697282] transition-colors"
            aria-label="رجوع"
          >
            <ArrowRight size={20} />
          </button>
        )}

        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00549A] to-[#0070c0] text-white flex items-center justify-center font-[Cairo] font-bold text-base shadow-md shadow-[#00549A]/15">
          {firstLetter}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-[Cairo] font-bold text-[#101727] truncate">{user?.name}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00549A]/8 text-[#00549A] font-[Cairo] text-[10px] font-bold">
              <Shield size={10} />
              متبرع
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
            <span className="font-[Cairo] text-xs text-[#697282]">{getStatusText()}</span>
          </div>
        </div>

        {connectionStatus === 'connecting' && <Loader2 className="text-[#00549A] animate-spin" size={18} />}
        {connectionStatus === 'reconnecting' && <Loader2 className="text-[#00549A] animate-spin" size={18} />}
        {(connectionStatus === 'disconnected' || connectionStatus === 'error') && onReconnect && (
          <Button
            onClick={onReconnect}
            variant="outline"
            className="flex items-center gap-2 font-[Cairo] text-xs border-[#00549A]/20 text-[#00549A] hover:bg-[#00549A]/5"
          >
            <RefreshCw size={14} />
            إعادة الاتصال
          </Button>
        )}
      </div>

      {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
        <div className="mt-3 px-3 py-2 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-[Cairo]">
          انقطع الاتصال بالخادم — اضغط على إعادة الاتصال للمتابعة
        </div>
      )}
    </div>
  );
};

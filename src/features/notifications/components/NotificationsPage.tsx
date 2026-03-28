import { useState } from 'react';
import { 
  CheckCheck, 
  DollarSign, 
  AlertCircle, 
  Clock,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'delay';
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'عملية دفع جديدة',
    message: 'تم استلام طلب دفع جديد من أحمد محمود السيد',
    time: '2026-01-08 10:30',
    type: 'payment',
    isRead: false,
  },
  {
    id: '2',
    title: 'كفالة متأخرة',
    message: 'كفالة محمد عبد الرحمن متأخرة عن الموعد',
    time: '2026-01-08 09:00',
    type: 'delay',
    isRead: false,
  },
  {
    id: '3',
    title: 'عملية دفع جديدة',
    message: 'تم استلام طلب دفع جديد من فاطمة حسن علي',
    time: '2026-01-08 09:15',
    type: 'payment',
    isRead: true,
  }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    toast.success('تم تحديد الإشعار كمقروء');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('تم تحديد جميع الإشعارات كمقروءة');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Filters (Counts) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#F8FAFC] px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-100 shadow-sm">
            <span className="font-[Cairo] text-[13px] text-[#697282]">إجمالي الإشعارات:</span>
            <span className="font-[Cairo] font-bold text-[13px] text-[#101727]">{totalCount}</span>
          </div>
          <div className="bg-[#EEF3FB] px-4 py-2 rounded-xl flex items-center gap-2 border border-[#00549A]/10 shadow-sm">
            <span className="font-[Cairo] text-[13px] text-[#00549A]">الإشعارات غير المقروءة:</span>
            <span className="font-[Cairo] font-bold text-[13px] text-[#00549A]">{unreadCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-start">
          <button 
            onClick={markAllAsRead}
            className="bg-[#00549A] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-[Cairo] font-bold text-[14px] hover:bg-[#004480] transition-all active:scale-95 shadow-lg shadow-[#00549A]/20"
          >
            <CheckCheck size={18} />
            تحديد الكل كمقروء
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`relative group transition-all duration-300 rounded-[24px] border-2 ${
              notification.isRead 
                ? 'bg-white border-transparent shadow-sm' 
                : 'bg-white border-[#00549A] shadow-md'
            }`}
          >
            <div className="p-6 flex items-start gap-6">
              {/* Unread Indicator Dot */}
              {!notification.isRead && (
                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#00549A] rounded-full shadow-sm" />
              )}

              {/* Content */}
              <div className="flex-1 space-y-3 mr-8">
                <div className="flex items-center justify-between">
                  <h3 className={`font-[Cairo] font-bold text-lg ${notification.type === 'delay' ? 'text-[#D32F2F]' : 'text-[#00549A]'}`}>
                    {notification.title}
                  </h3>
                </div>
                <p className="font-[Cairo] text-[#495565] text-[15px] leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <Clock size={14} />
                  <span className="font-[Cairo] text-[12px]">{notification.time}</span>
                </div>
              </div>

              {/* Type Icon */}
              <div className={`p-4 rounded-full flex-shrink-0 ${
                notification.type === 'delay' 
                  ? 'bg-[#FDECEA] text-[#D32F2F]' 
                  : 'bg-[#EEF3FB] text-[#00549A]'
              }`}>
                {notification.type === 'delay' ? <AlertCircle size={24} /> : <DollarSign size={24} />}
              </div>

              {/* Mark as read button (visible on hover or if unread) */}
              {!notification.isRead && (
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="absolute bottom-6 right-6 flex items-center gap-1.5 text-[#00549A] font-[Cairo] font-bold text-[13px] hover:underline"
                >
                  <Check size={14} />
                  تحديد كمقروء
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

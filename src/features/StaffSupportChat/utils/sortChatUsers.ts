import type { SupportChatUser } from '../types/support';

export function sortChatUsers(users: SupportChatUser[]): SupportChatUser[] {
  return [...users].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;

    if (bTime !== aTime) return bTime - aTime;

    const aUnread = a.unreadCount ?? 0;
    const bUnread = b.unreadCount ?? 0;
    if (bUnread !== aUnread) return bUnread - aUnread;

    return a.name.localeCompare(b.name, 'ar');
  });
}

export function mergeUserActivity(
  user: SupportChatUser,
  activity: {
    lastMessageAt: string;
    lastMessageText: string;
    lastMessageFromStaff?: boolean;
    unreadCount?: number;
  },
): SupportChatUser {
  const currentTime = user.lastMessageAt ? new Date(user.lastMessageAt).getTime() : 0;
  const nextTime = new Date(activity.lastMessageAt).getTime();

  if (nextTime < currentTime) {
    return user;
  }

  return {
    ...user,
    lastMessageAt: activity.lastMessageAt,
    lastMessageText: activity.lastMessageText,
    lastMessageFromStaff: activity.lastMessageFromStaff,
    unreadCount: activity.unreadCount ?? user.unreadCount,
  };
}

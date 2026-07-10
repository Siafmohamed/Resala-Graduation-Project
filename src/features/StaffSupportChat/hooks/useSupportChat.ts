import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supportSignalR } from '../services/supportSignalR';
import { supportApi } from '../services/supportApi';
import api from '@/api/axiosInstance';
import type { SupportChatMessage, SupportChatUser } from '../types/support';
import type { ConnectionStatus } from '../services/supportSignalR';
import { mergeUserActivity, sortChatUsers } from '../utils/sortChatUsers';

interface DonorListItem {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface DonorListResponse {
  totalRows: number;
  pageSize: number;
  pageIndex: number;
  items: DonorListItem[];
}

const ACTIVITY_STORAGE_KEY = 'supportChat:lastActivity';

const handleApiResponse = <T>(response: any): T => {
  if (response && 'isSuccess' in response && 'value' in response) {
    return response.value;
  } else if (response && 'succeeded' in response && 'data' in response) {
    return response.data;
  } else if (response && 'data' in response) {
    return response.data;
  }
  return response;
};

const loadStoredActivity = (): Record<string, Pick<SupportChatUser, 'lastMessageAt' | 'lastMessageText' | 'lastMessageFromStaff'>> => {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStoredActivity = (
  activity: Record<string, Pick<SupportChatUser, 'lastMessageAt' | 'lastMessageText' | 'lastMessageFromStaff'>>,
) => {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
  } catch {
    // ignore storage errors
  }
};

const applyActivityToUsers = (
  users: SupportChatUser[],
  storedActivity: Record<string, Pick<SupportChatUser, 'lastMessageAt' | 'lastMessageText' | 'lastMessageFromStaff'>>,
): SupportChatUser[] => {
  return users.map((user) => {
    const activity = storedActivity[user.id];
    if (!activity?.lastMessageAt) return user;
    return mergeUserActivity(user, {
      lastMessageAt: activity.lastMessageAt,
      lastMessageText: activity.lastMessageText || '',
      lastMessageFromStaff: activity.lastMessageFromStaff,
    });
  });
};

export const useSupportChat = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [users, setUsers] = useState<SupportChatUser[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    supportSignalR.getConnectionStatus()
  );
  const queryClient = useQueryClient();
  const storedActivityRef = useRef(loadStoredActivity());

  const persistActivity = useCallback((userId: string, activity: {
    lastMessageAt: string;
    lastMessageText: string;
    lastMessageFromStaff?: boolean;
  }) => {
    const current = storedActivityRef.current[userId];
    const currentTime = current?.lastMessageAt ? new Date(current.lastMessageAt).getTime() : 0;
    const nextTime = new Date(activity.lastMessageAt).getTime();
    if (currentTime > nextTime) return;

    storedActivityRef.current = {
      ...storedActivityRef.current,
      [userId]: activity,
    };
    saveStoredActivity(storedActivityRef.current);
  }, []);

  const bumpUserActivity = useCallback((
    userId: string,
    activity: {
      lastMessageAt: string;
      lastMessageText: string;
      lastMessageFromStaff?: boolean;
      incrementUnread?: boolean;
    },
  ) => {
    persistActivity(userId, activity);

    setUsers((prev) => {
      const existing = prev.find((user) => user.id === userId);
      const baseUser: SupportChatUser = existing ?? {
        id: userId,
        name: `متبرع #${userId}`,
        unreadCount: 0,
      };

      const nextUser = mergeUserActivity(baseUser, {
        lastMessageAt: activity.lastMessageAt,
        lastMessageText: activity.lastMessageText,
        lastMessageFromStaff: activity.lastMessageFromStaff,
        unreadCount: activity.incrementUnread
          ? (existing?.unreadCount || 0) + 1
          : existing?.unreadCount,
      });

      const withoutUser = prev.filter((user) => user.id !== userId);
      return sortChatUsers([nextUser, ...withoutUser]);
    });
  }, [persistActivity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const donorsQuery = useQuery({
    queryKey: ['supportChatDonors', debouncedSearch, page],
    queryFn: async () => {
      const response = await api.get('/v1/in-kind-donations/donors', {
        params: {
          search: debouncedSearch || undefined,
          pageNumber: page,
          pageSize: 20,
        },
      });
      const data = handleApiResponse<DonorListResponse>(response);
      setTotalRows(data.totalRows);
      return data.items;
    },
  });

  const handleMessageReceived = useCallback((message: SupportChatMessage) => {
    if (message.chatOwnerUserId === activeChatId) {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (!exists) {
          return [...prev, message];
        }
        return prev;
      });
    }

    bumpUserActivity(message.chatOwnerUserId, {
      lastMessageAt: message.createdOn,
      lastMessageText: message.messageText,
      lastMessageFromStaff: message.isFromStaff,
      incrementUnread: message.chatOwnerUserId !== activeChatId && !message.isFromStaff,
    });
  }, [activeChatId, bumpUserActivity]);

  useEffect(() => {
    const unsubscribeMessage = supportSignalR.onMessageReceived(handleMessageReceived);
    const unsubscribeStatus = supportSignalR.onConnectionStatusChanged(setConnectionStatus);
    supportSignalR.startConnection();

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      supportSignalR.stopConnection();
    };
  }, [handleMessageReceived]);

  const historyQuery = useQuery({
    queryKey: ['supportChatHistory', activeChatId],
    queryFn: async () => {
      if (!activeChatId) return null;
      const history = await supportApi.getChatHistory({ chatOwnerUserId: activeChatId });
      return history;
    },
    enabled: !!activeChatId,
  });

  useEffect(() => {
    if (historyQuery.data?.items) {
      const reversedMessages = [...historyQuery.data.items].reverse();
      setMessages(reversedMessages);

      const latest = historyQuery.data.items.reduce((acc, message) =>
        !acc || new Date(message.createdOn) > new Date(acc.createdOn) ? message : acc,
      historyQuery.data.items[0]);

      if (latest && activeChatId) {
        bumpUserActivity(activeChatId, {
          lastMessageAt: latest.createdOn,
          lastMessageText: latest.messageText,
          lastMessageFromStaff: latest.isFromStaff,
        });
      }
    }
  }, [historyQuery.data, activeChatId, bumpUserActivity]);

  useEffect(() => {
    if (!donorsQuery.data) return;

    setUsers((prevUsers) => {
      const merged = donorsQuery.data.map((donor) => {
        const existing = prevUsers.find((user) => user.id === String(donor.id));
        const baseUser: SupportChatUser = {
          id: String(donor.id),
          name: donor.fullName,
          unreadCount: existing?.unreadCount ?? 0,
          lastMessageAt: existing?.lastMessageAt,
          lastMessageText: existing?.lastMessageText,
          lastMessageFromStaff: existing?.lastMessageFromStaff,
        };

        const stored = storedActivityRef.current[String(donor.id)];
        if (stored?.lastMessageAt) {
          return mergeUserActivity(baseUser, {
            lastMessageAt: stored.lastMessageAt,
            lastMessageText: stored.lastMessageText || '',
            lastMessageFromStaff: stored.lastMessageFromStaff,
          });
        }

        return baseUser;
      });

      return sortChatUsers(applyActivityToUsers(merged, storedActivityRef.current));
    });
  }, [donorsQuery.data]);

  useEffect(() => {
    if (!donorsQuery.data?.length) return;

    let cancelled = false;

    const prefetchLatestMessages = async () => {
      const results = await Promise.all(
        donorsQuery.data.map(async (donor) => {
          const userId = String(donor.id);
          try {
            const latest = await supportApi.getLatestMessage(userId);
            if (!latest) return null;
            return { userId, latest };
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) return;

      results.forEach((result) => {
        if (!result) return;
        bumpUserActivity(result.userId, {
          lastMessageAt: result.latest.createdOn,
          lastMessageText: result.latest.messageText,
          lastMessageFromStaff: result.latest.isFromStaff,
        });
      });
    };

    prefetchLatestMessages();

    return () => {
      cancelled = true;
    };
  }, [donorsQuery.data, bumpUserActivity]);

  const openChat = useCallback(async (userId: string) => {
    if (!userId) {
      setActiveChatId(null);
      setMessages([]);
      return;
    }

    setActiveChatId(userId);
    setMessages([]);

    setUsers((prev) => sortChatUsers(
      prev.map((user) =>
        user.id === userId ? { ...user, unreadCount: 0 } : user,
      ),
    ));

    try {
      await supportApi.markMessagesAsRead(userId);
      queryClient.invalidateQueries({ queryKey: ['supportChatHistory', userId] });
    } catch (error) {
      console.error('[SupportChat] Error marking messages as read:', error);
    }
  }, [queryClient]);

  const sendChatMessage = useCallback(
    async (messageText: string) => {
      if (!activeChatId) return;

      bumpUserActivity(activeChatId, {
        lastMessageAt: new Date().toISOString(),
        lastMessageText: messageText,
        lastMessageFromStaff: true,
      });

      await supportSignalR.sendMessage(activeChatId, messageText);
    },
    [activeChatId, bumpUserActivity],
  );

  const reconnect = useCallback(() => {
    supportSignalR.startConnection();
  }, []);

  const sortedUsers = useMemo(() => sortChatUsers(users), [users]);

  return {
    activeChatId,
    messages,
    users: sortedUsers,
    setUsers,
    search,
    setSearch,
    page,
    setPage,
    totalRows,
    connectionStatus,
    openChat,
    sendChatMessage,
    reconnect,
    historyQuery,
    donorsQuery,
  };
};

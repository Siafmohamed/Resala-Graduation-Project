import React, { useState, useMemo, useEffect } from 'react';
import { DonorList } from '../components/DonorList';
import { ChatWindow } from '../components/ChatWindow';
import { useDonors } from '../hooks/useDonors';
import { useChatSocket } from '../hooks/useChatSocket';
import type { DonorListItem } from '../types/donor';
import type { Message } from '../types/message';

export const DonorChatPage: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    search,
    setSearch,
    page,
    setPage
  } = useDonors();

  const [selectedDonor, setSelectedDonor] = useState<DonorListItem | undefined>();
  const [donorLastMessages, setDonorLastMessages] = useState<Map<number, { timestamp: Date; unread: boolean }>>(new Map());

  const {
    messages,
    sendMessage,
    connectionStatus,
    reconnect
  } = useChatSocket(selectedDonor?.id);

  // Update last message time when a new message comes in
  useEffect(() => {
    if (messages.length === 0 || !selectedDonor) return;
    const lastMessage = messages[messages.length - 1];
    
    setDonorLastMessages(prev => {
      const newMap = new Map(prev);
      const isFromDonor = lastMessage.senderId === selectedDonor.id;
      
      if (isFromDonor && !selectedDonor) {
        // Donor sent message but we're not in chat: increase unread
        const existing = newMap.get(selectedDonor.id);
        newMap.set(selectedDonor.id, {
          timestamp: lastMessage.timestamp,
          unread: true
        });
      } else {
        // We are in chat or we sent message: update timestamp, mark unread false
        newMap.set(selectedDonor.id, {
          timestamp: lastMessage.timestamp,
          unread: false
        });
      }
      return newMap;
    });
  }, [messages, selectedDonor]);

  // Mark unread as false when selecting a donor
  const handleSelectDonor = (donor: DonorListItem) => {
    setSelectedDonor(donor);
    setDonorLastMessages(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(donor.id);
      if (existing) {
        newMap.set(donor.id, { ...existing, unread: false });
      }
      return newMap;
    });
  };

  // Sort donors by last message time descending
  const sortedDonors = useMemo(() => {
    const donors = data?.items || [];
    return [...donors].sort((a, b) => {
      const aTime = donorLastMessages.get(a.id)?.timestamp || new Date(0);
      const bTime = donorLastMessages.get(b.id)?.timestamp || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  }, [data?.items, donorLastMessages]);

  // Enrich donors with last message info
  const enrichedDonors = useMemo(() => {
    return sortedDonors.map(donor => {
      const info = donorLastMessages.get(donor.id);
      return {
        ...donor,
        lastMessageAt: info?.timestamp,
        unreadCount: info?.unread ? 1 : 0
      };
    });
  }, [sortedDonors, donorLastMessages]);

  return (
    <div className="flex h-screen bg-[#F0F6FF] dir-rtl" dir="rtl">
      <div className="w-full md:w-1/3 lg:w-1/4">
        <DonorList
          donors={enrichedDonors}
          totalRows={data?.totalRows || 0}
          currentPage={page}
          pageSize={20}
          search={search}
          onSearchChange={setSearch}
          onPageChange={setPage}
          selectedDonorId={selectedDonor?.id}
          onDonorSelect={handleSelectDonor}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <div className="flex-1 hidden md:block">
        <ChatWindow
          donor={selectedDonor}
          messages={messages}
          onSend={sendMessage}
          connectionStatus={connectionStatus}
          onReconnect={reconnect}
        />
      </div>
    </div>
  );
};

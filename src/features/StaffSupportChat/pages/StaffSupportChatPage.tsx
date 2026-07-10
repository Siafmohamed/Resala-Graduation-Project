import React from 'react';
import { useSupportChat } from '../hooks/useSupportChat';
import { SupportChatUserList } from '../components/SupportChatUserList';
import { SupportChatWindow } from '../components/SupportChatWindow';

export const StaffSupportChatPage: React.FC = () => {
  const {
    activeChatId,
    messages,
    users,
    connectionStatus,
    openChat,
    sendChatMessage,
    reconnect,
    historyQuery,
    donorsQuery,
    search,
    setSearch,
    page,
    setPage,
    totalRows,
  } = useSupportChat();

  const activeUser = users.find((u) => u.id === activeChatId);
  const showMobileChat = !!activeUser;

  const handleCloseMobileChat = () => {
    openChat('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[600px] p-4 md:p-6 bg-[#f8fafc]" dir="rtl">
      <div className="flex flex-1 min-h-0 rounded-2xl md:rounded-3xl border border-gray-200/80 bg-white shadow-[0_8px_40px_rgba(0,84,154,0.06)] overflow-hidden">
        <div
          className={`w-full md:w-[340px] lg:w-[380px] shrink-0 border-l border-gray-100 ${
            showMobileChat ? 'hidden md:flex' : 'flex'
          } flex-col`}
        >
          <SupportChatUserList
            users={users}
            activeUserId={activeChatId || undefined}
            onUserSelect={(user) => openChat(user.id)}
            isLoading={donorsQuery.isLoading}
            error={donorsQuery.error}
            search={search}
            onSearchChange={setSearch}
            page={page}
            totalRows={totalRows}
            onPageChange={setPage}
          />
        </div>

        <div className={`flex-1 min-w-0 ${showMobileChat ? 'flex' : 'hidden md:flex'} flex-col`}>
          <SupportChatWindow
            user={activeUser}
            messages={messages}
            onSend={sendChatMessage}
            connectionStatus={connectionStatus}
            onReconnect={reconnect}
            isLoadingHistory={historyQuery.isLoading}
            onBack={showMobileChat ? handleCloseMobileChat : undefined}
          />
        </div>
      </div>
    </div>
  );
};

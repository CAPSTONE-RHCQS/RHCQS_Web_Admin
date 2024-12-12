import React, { createContext, useContext, useState } from 'react';
import ChatBox from '../components/Chat/ChatBox';

interface ChatContextType {
  showChatBox: boolean;
  selectedChatId: string | null;
  accountName: string | null;
  userRole: string | null;
  openChat: (chatId: string, name: string, role: string) => void;
  closeChat: () => void;
  toggleDropdown: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showChatBox, setShowChatBox] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openChat = (chatId: string, name: string, role: string) => {
    if (role === '9959ce96-de26-40a7-b8a7-28a704062e89') {
      setSelectedChatId(chatId);
      setAccountName(name);
      setShowChatBox(true);
    } else {
      alert('Hiện đang phát triển.');
    }
  };

  const closeChat = () => {
    setShowChatBox(false);
    setSelectedChatId(null);
    setAccountName(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <ChatContext.Provider
      value={{
        showChatBox,
        selectedChatId,
        accountName,
        userRole,
        openChat,
        closeChat,
        toggleDropdown,
        isDropdownOpen,
        setIsDropdownOpen,
      }}
    >
      {children}
      {showChatBox && (
        <ChatBox
          isOpen={showChatBox}
          selectedChat={selectedChatId!}
          onClose={closeChat}
          accountName={accountName!}
          note={null}
        />
      )}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

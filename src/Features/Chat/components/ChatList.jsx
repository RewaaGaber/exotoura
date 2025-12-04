import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import UserAvatar from "../../../Components/ui/UserAvarar";
import { useGetCurrentUser } from "../../Users";
import useChatStore from "../hooks/useChatStore";
import { FiCheck, FiCheckCircle } from "react-icons/fi";
import { getParticipantName } from "../utils/chatUtils";

const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: userData } = useGetCurrentUser();
  const { chats, setSelectedChatId } = useChatStore();

  const getMessagePreview = (chat) => {
    const currentUserId = userData?.data?.user?._id;
    const chatId = chat._id;
    const isTyping = useChatStore.getState().typingUsers[chatId]?.length > 0;

    if (isTyping) {
      if (chat.isGroup) {
        const typingUsers = useChatStore.getState().typingUsers[chatId] || [];
        const typingParticipants = chat.participants.filter(
          (p) => typingUsers.includes(p._id) && p._id !== currentUserId
        );

        if (typingParticipants.length > 0) {
          return `${typingParticipants[0].fullName?.firstName}: typing...`;
        }
      }
      return "typing...";
    }

    if (!chat.lastMessage) return "No messages yet";

    if (!chat.lastMessage.sender) {
      return chat.lastMessage.content;
    }

    const isCurrentUser = chat.lastMessage.sender._id === currentUserId;

    if (chat.isGroup) {
      return `${isCurrentUser ? "You" : chat.lastMessage.sender.fullName?.firstName}: ${
        chat.lastMessage.content
      }`;
    }
    return chat.lastMessage.content;
  };

  const getReadStatus = (chat) => {
    const chatId = chat._id;
    const typingUsers = useChatStore.getState().typingUsers[chatId] || [];
    const currentUserId = userData?.data?.user?._id;

    if (typingUsers.length > 0) return null;
    if (!chat.lastMessage?.readBy || !chat.lastMessage.sender) return null;

    const isCurrentUserSender = chat.lastMessage.sender._id === currentUserId;
    if (!isCurrentUserSender) return null;

    if (chat.isGroup) {
      const allRead = chat.lastMessage.readBy.length === chat.participants.length;
      return allRead ? (
        <FiCheckCircle className="text-xs text-blue-500" />
      ) : (
        <FiCheck className="text-xs text-gray-400" />
      );
    } else {
      return chat.lastMessage.readBy.length === 2 ? (
        <FiCheckCircle className="text-xs text-blue-500" />
      ) : (
        <FiCheck className="text-xs text-gray-400" />
      );
    }
  };

  const isSystemMessage = (chat) => {
    return chat.lastMessage && !chat.lastMessage.sender;
  };

  const filteredChats = chats.filter((chat) =>
    getParticipantName(chat, userData).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all"
          />
        </motion.div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012 2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              {searchQuery ? "No matching chats found" : "No chats available"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredChats.map((chat) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                onClick={() => setSelectedChatId(chat._id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  chat.unreadCount > 0 ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <UserAvatar
                      profilePicture={
                        chat.isGroup
                          ? chat.groupPicture || undefined
                          : chat.participants.find(
                              (p) => p._id !== userData?.data?.user?._id
                            )?.profilePicture
                      }
                      size={48}
                      isGroup={chat.isGroup}
                      unreadCount={chat.unreadCount || 0}
                    />
                    {chat.unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {chat.unreadCount}
                      </motion.span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {getParticipantName(chat, userData)}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {chat.lastMessage?.createdAt
                          ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isSystemMessage(chat) ? "justify-center" : ""
                      }`}
                    >
                      {!isSystemMessage(chat) && (
                        <span className="text-xs">{getReadStatus(chat)}</span>
                      )}
                      <p
                        className={`text-sm ${
                          isSystemMessage(chat)
                            ? "text-gray-400 italic text-center"
                            : chat.unreadCount > 0
                            ? "text-gray-800 font-medium"
                            : "text-gray-500"
                        } truncate`}
                      >
                        {getMessagePreview(chat)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ChatList;

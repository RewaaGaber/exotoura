import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "../../../Components/ui/UserAvarar";
import { useGetChatByIdQuery } from "../hooks/useChatApi";
import { useGetCurrentUser } from "../../Users/hooks/useUserApi";
import useChatStore from "../hooks/useChatStore";
import { isTempChatId } from "../utils/isTempChatId";
import { getChatParticipantName } from "../utils/chatUtils";
import { FiCheck, FiCheckCircle, FiArrowDown } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";

const ChatWindow = ({ chatId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const { data: userData } = useGetCurrentUser();
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    messages: messagesData,
    sendMessage,
    chats,
    setMessages,
    typingUsers,
    startTyping,
    stopTyping,
  } = useChatStore();

  const messages = messagesData[chatId] || [];
  const chat = chats.find((c) => c._id === chatId);
  const currentUserId = userData?.data?.user?._id;

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setHasNewMessages(false);
      if (messages.length > 0) {
        setLastSeenMessageId(messages[messages.length - 1]._id);
      }
    }
  }, [messages]);

  // Auto-scroll and new message detection
  useEffect(() => {
    if (!messagesContainerRef.current || !messages.length) return;

    const container = messagesContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
      setHasNewMessages(false);
      if (messages.length > 0) {
        setLastSeenMessageId(messages[messages.length - 1]._id);
      }
    } else if (
      messages.length > 0 &&
      messages[messages.length - 1]._id !== lastSeenMessageId &&
      messages[messages.length - 1].sender._id !== currentUserId
    ) {
      setHasNewMessages(true);
    }
  }, [messages, lastSeenMessageId, currentUserId]);

  const { isLoading, error: chatError, isSuccess, data } = useGetChatByIdQuery(chatId);

  // Load messages when chat is successfully fetched
  useEffect(() => {
    if (isTempChatId(chatId)) return;
    const messages = messagesData[chatId] || [];
    if (isSuccess && messages.length === 0) {
      setMessages(chatId, data.data.messages);
    }
  }, [chatId, isSuccess, data, messagesData, setMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const isTempChat = isTempChatId(chatId);
    const currentChat = chats.find((c) => c._id === chatId);

    sendMessage({
      chatId: isTempChat ? undefined : chatId,
      participants: isTempChat ? currentChat?.participants.map((p) => p._id) : undefined,
      content: newMessage,
      clientTempId: isTempChat ? chatId : undefined,
    });
    stopTyping();
    setNewMessage("");
    scrollToBottom();
  };

  // Improved typing indicator with debounce
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setNewMessage(value);

      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (value.trim()) {
        startTyping();
        // Set timeout to stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping();
        }, 3000);
      } else {
        stopTyping();
      }
    },
    [startTyping, stopTyping]
  );

  // Get typing users for this chat
  const currentTypingUsers = typingUsers[chatId] || [];

  // Format typing indicator text
  const getTypingText = () => {
    if (currentTypingUsers.length === 0) return null;

    if (chat?.isGroup) {
      const names = currentTypingUsers
        .filter((userId) => userId !== currentUserId)
        .map((userId) => {
          const user = chat.participants.find((p) => p._id === userId);
          return user ? user.fullName.firstName : "Someone";
        });

      if (names.length === 0) return null;

      if (names.length === 1) return `${names[0]} is typing...`;
      if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
      return `${names[0]}, ${names[1]} and others are typing...`;
    }

    return "typing...";
  };

  const typingText = getTypingText();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <UserAvatar
            profilePicture={
              chat?.isGroup
                ? chat.groupPicture || undefined
                : chat?.participants.find((p) => p._id !== currentUserId)?.profilePicture
            }
            isGroup={chat?.isGroup}
            size={48}
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {getChatParticipantName(chat, currentUserId)}
            </h3>
            <AnimatePresence>
              {typingText && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-amber-600 italic"
                >
                  {typingText}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )}

        <AnimatePresence>
          {messages?.map((message) => {
            const isSystem = message.senderType === "system";
            const senderId = message.sender?._id;

            if (isSystem) {
              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center my-4"
                >
                  <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm inline-flex items-center gap-2">
                    <span>🔒</span>
                    <span>{message.content}</span>
                  </div>
                </motion.div>
              );
            }

            if (!message.sender) return null;

            const isOtherUser = senderId !== currentUserId;

            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: isOtherUser ? -20 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isOtherUser ? "justify-start" : "justify-end"}`}
              >
                <div className="flex flex-col max-w-[80%]">
                  {isOtherUser && chat?.isGroup && message.sender && (
                    <div className="flex items-center gap-2 mb-1">
                      <UserAvatar
                        profilePicture={message.sender.profilePicture}
                        size={24}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {message.sender.fullName.firstName}
                      </span>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl p-3 ${
                      isOtherUser
                        ? "bg-white border border-gray-200"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                    } shadow-sm`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <div className="flex items-center gap-1 mt-1 ml-auto w-fit">
                      <p
                        className={`text-xs ${
                          isOtherUser ? "text-gray-500" : "text-amber-100"
                        }`}
                      >
                        {format(new Date(message.createdAt), "h:mm a")}
                      </p>
                      {!isOtherUser && message.readBy && (
                        <span className="text-xs">
                          {message.readBy.length > 1 ? (
                            <FiCheckCircle className="text-blue-200" />
                          ) : (
                            <FiCheck className="text-amber-200" />
                          )}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* New messages notification */}
      <AnimatePresence>
        {hasNewMessages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
          >
            <button
              onClick={scrollToBottom}
              className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-amber-600 transition-colors"
            >
              <FiArrowDown className="w-4 h-4" />
              <span>New messages</span>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onBlur={stopTyping}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim()}
            whileHover={{ scale: newMessage.trim() ? 1.05 : 1 }}
            whileTap={{ scale: newMessage.trim() ? 0.95 : 1 }}
            className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all ${
              newMessage.trim()
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <IoMdSend className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

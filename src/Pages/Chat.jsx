import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ChatList from "../Features/Chat/components/ChatList";
import ChatWindow from "../Features/Chat/components/ChatWindow";
import useChatStore from "../Features/Chat/hooks/useChatStore";

const Chat = () => {
  const { selectedChatId, setSelectedChatId } = useChatStore();

  useEffect(() => {
    return () => setSelectedChatId(null);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-[calc(100vh-4rem)]">
      <div className="container mx-auto h-full p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-full rounded-2xl overflow-hidden shadow-xl"
        >
          <div className={`bg-white ${selectedChatId ? "hidden md:block" : ""}`}>
            <ChatList />
          </div>

          {selectedChatId ? (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-gray-50"
            >
              <ChatWindow chatId={selectedChatId} />
            </motion.div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center p-8 max-w-md"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-amber-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Select a chat
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;

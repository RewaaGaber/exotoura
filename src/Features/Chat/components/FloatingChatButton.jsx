import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import ChatPreview from "./ChatPreview";
import useChatStore from "../hooks/useChatStore";

const FloatingChatButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { chats } = useChatStore();

  // Hide the button on the chat page
  if (location.pathname === "/chat") {
    return null;
  }

  // Calculate total unread messages across all chats
  const totalUnreadCount = chats.reduce(
    (total, chat) => total + (chat.unreadCount || 0),
    0
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-80"
          >
            <ChatPreview />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg"
      >
        <FaComments className="w-6 h-6" />
        {totalUnreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {totalUnreadCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChatButton;

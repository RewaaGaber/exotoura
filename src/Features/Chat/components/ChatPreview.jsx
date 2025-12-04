import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaComments, FaArrowRight } from "react-icons/fa";
import UserAvatar from "../../../Components/ui/UserAvarar";
import useChatStore from "../hooks/useChatStore";
import { useGetCurrentUser } from "../../Users";
import { getParticipantName } from "../utils/chatUtils";

const ChatPreview = () => {
  const navigate = useNavigate();
  const { chats } = useChatStore();
  const { data: userData } = useGetCurrentUser();

  // Get the 3 most recent chats
  const recentChats = chats
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)
    )
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaComments className="text-amber-500 text-xl" />
          <h3 className="text-xl font-semibold text-gray-800">Recent Chats</h3>
        </div>
        <button
          onClick={() => navigate("/chat")}
          className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center space-x-1 group"
        >
          <span>View All</span>
          <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {recentChats.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No recent chats</div>
        ) : (
          recentChats.map((chat) => {
            const chatName = getParticipantName(chat, userData);

            return (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-amber-100 transition-all duration-200"
                onClick={() => navigate(`/chat?id=${chat._id}`)}
              >
                <div className="relative">
                  <UserAvatar
                    profilePicture={
                      chat.participants.length === 2
                        ? chat.participants.find(
                            (p) => p._id !== userData?.data?.user?._id
                          )?.profilePicture
                        : undefined
                    }
                    size={40}
                    isGroup={chat.participants.length > 2}
                  />
                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">{chatName}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {chat.lastMessage?.createdAt
                        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    {chat.lastMessage ? (
                      <>
                        {chat.isGroup && chat.lastMessage.sender?.fullName?.firstName && (
                          <span className="font-medium text-gray-700">
                            {chat.lastMessage.sender.fullName.firstName}:
                          </span>
                        )}
                        <span className={`ml-${chat.isGroup ? "1" : "0"} truncate`}>
                          {chat.lastMessage.content}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">No messages yet</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default ChatPreview;

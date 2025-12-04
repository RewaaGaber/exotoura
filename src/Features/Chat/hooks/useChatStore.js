import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "../../Auth";
import { isTempChatId } from "../utils/isTempChatId";

const useChatStore = create((set, get) => ({
  selectedChatId: null,
  socket: null,
  chats: [],
  messages: {},
  typingUsers: {},
  typingTimeouts: {},
  typingFlags: {},
  fetchedChats: new Set(),

  initializeSocket: () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    if (get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
    });
    socket.on("disconnect", (reason) => {
      // console.log("Socket disconnected:", reason);
    });

    socket.on("incoming_chat_message", (payload) => {
      const { chat: serverChat, message, isNewChat, clientTempId } = payload;

      set((state) => {
        const isSelectedChat = state.selectedChatId === serverChat._id;
        let updatedChats = state.chats;
        let updatedMessages = { ...state.messages };
        let updatedSelectedChatId = state.selectedChatId;

        if (isNewChat) {
          if (clientTempId) {
            const tempChatIndex = state.chats.findIndex((c) => c._id === clientTempId);
            if (tempChatIndex !== -1) {
              const tempChat = state.chats[tempChatIndex];

              const mergedChat = {
                ...serverChat,
                participants: tempChat.participants,
              };

              if (state.selectedChatId === clientTempId) {
                updatedSelectedChatId = serverChat._id;
              }

              const tempMessages = state.messages[clientTempId] || [];
              updatedMessages[serverChat._id] = [...tempMessages, message];
              delete updatedMessages[clientTempId];

              updatedChats = [...state.chats];
              updatedChats.splice(tempChatIndex, 1); // remove temp chat
              updatedChats = [mergedChat, ...updatedChats]; // add merged chat at top
            } else {
              updatedChats = [serverChat, ...state.chats];
              updatedMessages[serverChat._id] = [message];
            }
          } else {
            const existingChat = state.chats.find((c) => c._id === serverChat._id);
            if (!existingChat) {
              updatedChats = [serverChat, ...state.chats];
            } else {
              const updatedChat = {
                ...existingChat,
                lastMessage: serverChat.lastMessage,
                updatedAt: serverChat.updatedAt,
                unreadCount: isSelectedChat ? 0 : (existingChat.unreadCount || 0) + 1,
              };

              const otherChats = state.chats.filter((c) => c._id !== serverChat._id);
              updatedChats = [updatedChat, ...otherChats];
            }

            const prevMessages = updatedMessages[serverChat._id] || [];
            updatedMessages[serverChat._id] = [...prevMessages, message];
          }
        } else {
          const existingChat = state.chats.find((c) => c._id === serverChat._id);
          if (existingChat) {
            const updatedChat = {
              ...existingChat,
              lastMessage: serverChat.lastMessage,
              updatedAt: serverChat.updatedAt,
              unreadCount: isSelectedChat ? 0 : (existingChat.unreadCount || 0) + 1,
            };

            const otherChats = state.chats.filter((c) => c._id !== serverChat._id);
            updatedChats = [updatedChat, ...otherChats];
          }

          if (state.fetchedChats.has(serverChat._id)) {
            const prevMessages = updatedMessages[serverChat._id] || [];
            updatedMessages[serverChat._id] = [...prevMessages, message];
          }
        }

        if (isSelectedChat && !isTempChatId(serverChat._id)) {
          setTimeout(() => get().markMessagesAsRead(), 0);
        }

        return {
          chats: updatedChats,
          messages: updatedMessages,
          selectedChatId: updatedSelectedChatId,
        };
      });
    });

    socket.on("user_typing", ({ userId, chatId }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [chatId]: [...new Set([...(state.typingUsers[chatId] || []), userId])],
        },
      }));
    });

    socket.on("user_stopped_typing", ({ userId, chatId }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [chatId]: (state.typingUsers[chatId] || []).filter((id) => id !== userId),
        },
      }));
    });

    socket.on("messages_read", ({ userId, chatId }) => {
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                unreadCount:
                  userId === chat.lastMessage?.sender?._id ? chat.unreadCount : 0,
                lastMessage: {
                  ...chat.lastMessage,
                  readBy: [...new Set([...(chat.lastMessage?.readBy || []), userId])],
                },
              }
            : chat
        );

        const updatedMessages = { ...state.messages };
        if (state.messages[chatId]) {
          updatedMessages[chatId] = state.messages[chatId].map((message) => ({
            ...message,
            readBy: [...new Set([...(message.readBy || []), userId])],
          }));
        }

        return {
          chats: updatedChats,
          messages: updatedMessages,
        };
      });
    });

    set({ socket });
  },

  setSelectedChatId: (chatId) => {
    set({ selectedChatId: chatId });

    get().markMessagesAsRead();
  },

  sendMessage: ({ chatId, participants, content, clientTempId }) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("send_message", {
      chatId,
      participants,
      content,
      clientTempId: !chatId ? clientTempId : undefined,
    });
  },

  addChat: (participants) => {
    set((state) => {
      // Sort participant IDs to ensure consistent comparison
      const newParticipantIds = participants
        .map((p) => p._id)
        .sort()
        .join(",");

      // Check if a chat with these participants already exists
      const existingChat = state.chats.find((chat) => {
        const existingParticipantIds = chat.participants
          .map((p) => p._id)
          .sort()
          .join(",");

        return existingParticipantIds === newParticipantIds;
      });

      // If chat exists, just select it
      if (existingChat) {
        return {
          selectedChatId: existingChat._id,
        };
      }

      // Otherwise create a new chat metadata object
      const chatMeta = {
        _id: `temp-${participants
          .map((p) => p._id)
          .sort()
          .join("-")}`,
        participants: participants,
        lastMessage: null,
        isActive: true,
        isGroup: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Add the new chat and select it
      return {
        chats: [...state.chats, chatMeta],
        selectedChatId: chatMeta._id,
      };
    });
  },
  setChats: (newChats) => {
    set((state) => {
      const existingTempChats = state.chats.filter((chat) => isTempChatId(chat._id));
      const newChatsMap = new Map(newChats.map((chat) => [chat._id, chat]));
      const preservedExistingChats = state.chats.filter(
        (chat) => !isTempChatId(chat._id) && !newChatsMap.has(chat._id)
      );

      return {
        chats: [...preservedExistingChats, ...existingTempChats, ...newChats],
      };
    });
  },
  setMessages: (chatId, messages) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: messages,
      },
      fetchedChats: new Set([...state.fetchedChats, chatId]),
    }));
  },

  startTyping: () => {
    const socket = get().socket;
    const chatId = get().selectedChatId;
    if (!socket || !chatId || isTempChatId(chatId)) return;

    const typingTimeouts = get().typingTimeouts;
    const typingFlags = get().typingFlags;

    if (!typingFlags[chatId]) {
      socket.emit("typing", { chatId });

      set((state) => ({
        typingFlags: { ...state.typingFlags, [chatId]: true },
      }));
    }

    if (typingTimeouts[chatId]) {
      clearTimeout(typingTimeouts[chatId]);
    }

    const timeoutId = setTimeout(() => {
      socket.emit("stop_typing", { chatId });

      set((state) => ({
        typingFlags: { ...state.typingFlags, [chatId]: false },
        typingTimeouts: { ...state.typingTimeouts, [chatId]: null },
      }));
    }, 3000);

    set((state) => ({
      typingTimeouts: { ...state.typingTimeouts, [chatId]: timeoutId },
    }));
  },

  stopTyping: () => {
    const socket = get().socket;
    const chatId = get().selectedChatId;
    if (!socket || !chatId || isTempChatId(chatId)) return;

    socket.emit("stop_typing", { chatId });

    set((state) => ({
      typingFlags: { ...state.typingFlags, [chatId]: false },
      typingTimeouts: { ...state.typingTimeouts, [chatId]: null },
    }));
  },

  markMessagesAsRead: () => {
    const socket = get().socket;
    const chatId = get().selectedChatId;
    if (!socket || !chatId || isTempChatId(chatId)) return;

    socket.emit("mark_messages_read", { chatId });
  },
}));

export default useChatStore;

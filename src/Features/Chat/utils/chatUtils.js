// src/Features/Chat/utils/chatUtils.js
export const getParticipantName = (chat, userData) => {
  const currentUserId = userData?.data?.user?._id;
  if (chat.isGroup) {
    return chat.name;
  }
  const otherParticipant = chat.participants.find((p) => p._id !== currentUserId);
  return otherParticipant?.fullName
    ? `${otherParticipant.fullName.firstName} ${otherParticipant.fullName.lastName}`.trim()
    : "Unknown User";
};

export const getChatParticipantName = (chat, currentUserId) => {
  if (!chat) return "Unknown Chat";

  if (chat.isGroup) {
    return chat.name;
  }

  const otherParticipant = chat.participants.find((p) => p._id !== currentUserId);
  return otherParticipant
    ? `${otherParticipant.fullName?.firstName || ""} ${
        otherParticipant.fullName?.lastName || ""
      }`.trim()
    : "Unknown User";
};

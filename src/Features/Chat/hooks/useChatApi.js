import { useApi } from "../../../hooks";

const useGetUserChatsQuery = () =>
  useApi({ url: "chat", method: "get", autoFetch: false });

const useGetChatByIdQuery = (chatId) => useApi({ url: `chat/${chatId}`, method: "get" });

export { useGetUserChatsQuery, useGetChatByIdQuery };

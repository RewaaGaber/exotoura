import { useApi } from "../../../hooks";

// GET user data (e.g., /users/me)
export const useGetCurrentUser = () => {
  return useApi({ url: "users/me" });
};

export const useUpdateUser = (type) => {
  return useApi({
    url: "users/me",
    method: "PATCH",
    ...(type === "form" && { contentType: "multipart/form-data" }),
  });
};

export const useGetAllVolunteers = (page, limit) => {
  return useApi({ url: `users/volunteer?page=${page}&limit=${limit}` });
};

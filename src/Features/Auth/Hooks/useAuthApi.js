import { useApi } from "../../../hooks";

const useLoginMutation = () => useApi({ url: "auth/login", method: "post" });

const useGoogleLoginMutation = () => useApi({ url: "auth/google/token", method: "post" });

const useLogoutMutation = () => useApi({ url: "auth/logout", method: "post" });

const useUpdateEmailMutation = () => useApi({ url: "auth/updateemail", method: "patch" });

const useUpdatePasswordMutation = () =>
  useApi({ url: "auth/updatepassword", method: "patch" });

export {
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
};

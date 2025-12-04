import { useState } from "react";
import { useMountEffect } from "primereact/hooks";
import apiFetcher from "../../../lib/apiFetcher";
import { useAuthStore } from "./useAuthStore";

const useRefetch = () => {
  const { setToken, persistLogin, refreshToken, setRefreshToken } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useMountEffect(() => {
    const refetch = async () => {
      try {
        setLoading(true);
        const { accessToken } = await apiFetcher({
          url: `auth/refresh${refreshToken ? `?refreshTokenBody=${refreshToken}` : ""}`,
        });
        setToken(accessToken);
      } catch (err) {
        setToken(null);
        setRefreshToken(null);
      } finally {
        setLoading(false);
      }
    };

    if (persistLogin) {
      refetch();
    }
  });

  return { loading };
};

export default useRefetch;

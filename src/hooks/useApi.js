import { useApiStore } from "./useApiStore";
import { generateKey } from "../utils/generateKey";
import { useMountEffect } from "primereact/hooks";
import { useEffect } from "react";

// Not used yet.
export const useApi = ({
  url,
  method = "get",
  body = null,
  autoFetch = true,
  contentType = "application/json",
  force = false,
}) => {
  const { fetches, fetchData } = useApiStore();
  const key = generateKey({ url, method, body });

  const fetchState = fetches[key] || {};

  useEffect(() => {
    if (autoFetch && method.toLowerCase() === "get") {
      fetchData({ url, method, body, contentType, force });
    }
  }, [key]);

  return {
    ...(autoFetch && method.toLowerCase() === "get" && { data: fetchState.data }),
    isLoading: fetchState.isLoading || false,
    isSuccess: fetchState.isSuccess || false,
    isError: fetchState.isError || false,
    error: fetchState.error,
    execute: (executeBody = {}, updateTarget, force = false) =>
      fetchData({ url, method, body: executeBody, force, contentType, updateTarget }),
  };
};

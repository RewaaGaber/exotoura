import { create } from "zustand";
import { devtools } from "zustand/middleware";
import apiFetcher from "../lib/apiFetcher";
import { generateKey } from "../utils/generateKey";
import { useAuthStore } from "../Features/Auth/Hooks/useAuthStore";
import lodash from "lodash";
import { normalizeFilesInData } from "../utils/normalizeFilesData";

const initialState = {
  data: null,
  isLoading: true,
  isSuccess: false,
  isError: false,
  error: null,
};

const setLoadingState = (set, key) => {
  set((state) => ({
    fetches: {
      ...state.fetches,
      [key]: { ...initialState },
    },
  }));
};
const setSuccessState = (set, key, response) => {
  set((state) => ({
    fetches: {
      ...state.fetches,
      [key]: {
        data: response,
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
      },
    },
  }));
};
const setErrorState = (set, key, error) => {
  set((state) => ({
    fetches: {
      ...state.fetches,
      [key]: {
        isError: true,
        error,
        isLoading: false,
      },
    },
  }));
};

const handleUnauthorized = async ({
  get,
  set,
  url,
  method,
  body,
  contentType,
  key,
  err,
}) => {
  if (!get().refreshTokenPromise) {
    const refreshToken = useAuthStore.getState().refreshToken;
    const refreshPromise = apiFetcher({
      url: `auth/refresh${refreshToken ? `?refreshTokenBody=${refreshToken}` : ""}`,
      contentType,
    })
      .then((response) => {
        const newToken = response.accessToken;
        useAuthStore.getState().setToken(newToken);
      })
      .finally(() => {
        set({ refreshTokenPromise: null });
      });

    set({ refreshTokenPromise: refreshPromise });
  }

  try {
    await get().refreshTokenPromise;
    const retryResponse = await apiFetcher({ url, method, data: body, contentType });
    setSuccessState(set, key, retryResponse);
    return retryResponse;
  } catch {
    setErrorState(set, key, err.response?.data);
    throw err;
  }
};

const updateExistingData = (
  set,
  get,
  { targetUrl, targetMethod, targetPath },
  newData
) => {
  const key = generateKey({ url: targetUrl, method: targetMethod });
  const currentFetch = get().fetches[key];

  if (!currentFetch || !currentFetch.data) return;

  newData = normalizeFilesInData(newData);

  set((state) => {
    const currentData = lodash.get(state.fetches[key].data, targetPath, {});
    const updatedData = lodash.merge({}, currentData, newData);

    return {
      fetches: {
        ...state.fetches,
        [key]: {
          ...state.fetches[key],
          data: lodash.set({ ...state.fetches[key].data }, targetPath, updatedData),
        },
      },
    };
  });
};

export const useApiStore = create(
  devtools((set, get) => ({
    fetches: {},
    refreshTokenPromise: null,

    fetchData: async ({
      url,
      method = "get",
      body = null,
      force = false,
      contentType,
      updateTarget = null,
    }) => {
      const key = generateKey({ url, method, body });
      const existingFetch = get().fetches[key];

      if (existingFetch && method.toLowerCase() === "get") {
        if (existingFetch.isSuccess && !force) return existingFetch.data;
        if (existingFetch.isLoading && !force) return;
      }

      setLoadingState(set, key);

      try {
        const response = await apiFetcher({ url, method, data: body, contentType });
        setSuccessState(set, key, response);

        if (updateTarget) {
          updateExistingData(set, get, updateTarget, body);
        }

        return response;
      } catch (err) {
        if (err.response?.status === 401) {
          return await handleUnauthorized({
            get,
            set,
            url,
            method,
            body,
            contentType,
            key,
            err,
          });
        }

        setErrorState(set, key, err.response?.data);
        throw err;
      }
    },

    clearData: (options) => {
      const key = generateKey(options);
      set((state) => ({
        fetches: { ...state.fetches, [key]: undefined },
      }));
    },

    clearAllData: () => set({ fetches: {} }),
  }))
);

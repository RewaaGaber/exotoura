import { useApi } from "../../hooks/useApi.js";

export const useGetEvent = (id) => useApi({ url: `event/${id}` });

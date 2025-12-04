import { useApi } from "../../../hooks";

export const useGetAllDisabilities = () => useApi({ url: "disability" });

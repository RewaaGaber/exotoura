import { useApi } from "../../../hooks";

const useCreateIntent = () => useApi({ url: "payment/create-intent", method: "post" });

const useGetCustomerPayments = (page = 1, limit = 10) =>
  useApi({ url: `payment/customer-activity?page=${page}&limit=${limit}` });

export { useGetCustomerPayments, useCreateIntent };

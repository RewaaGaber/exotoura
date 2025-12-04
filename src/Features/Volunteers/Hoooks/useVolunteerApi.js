import { useApi } from "../../../hooks";

const useGetAllVolunteeringRequests = (page, limit) =>
  useApi({ url: `volunteer-request/?page=${page}&limit=${limit}` });

const useGetAllCompletedVolunteeringRequests = (limit) =>
  useApi({ url: `volunteer-request/?status=COMPLETED&limit=${limit}` });

const useGetUserVolunteeringRequests = () =>
  useApi({ url: `volunteer-request/my-requests` });

const useGetVolunteerAssignedRequests = (status) =>
  useApi({ url: `volunteer-request/my-assigned-requests?status=${status}` });

const useGetVolunteerRequestById = (requestId) =>
  useApi({ url: `volunteer-request/${requestId}` });

const useCreateVolunteeringRequest = (body) =>
  useApi({ url: `volunteer-request/`, method: "POST", body });

const useUpdateVolunteeringRequest = (requestId) =>
  useApi({
    url: `volunteer-request/${requestId}`,
    method: "PATCH",
    contentType: "multipart/form-data",
  });

const useAssignVolunteeringRequest = (requestId, body) =>
  useApi({ url: `volunteer-request/${requestId}/assign`, method: "PATCH", body });

export {
  useGetAllVolunteeringRequests,
  useGetAllCompletedVolunteeringRequests,
  useGetUserVolunteeringRequests,
  useGetVolunteerAssignedRequests,
  useGetVolunteerRequestById,
  useCreateVolunteeringRequest,
  useUpdateVolunteeringRequest,
  useAssignVolunteeringRequest,
};

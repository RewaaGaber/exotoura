import { useApi } from "../../../hooks";

const useGetAllAccommodations = (page, limit) =>
  useApi({ url: `accommodation?page=${page}&limit=${limit}` });

const useCreateAccommodation = () =>
  useApi({
    url: "accommodation",
    method: "post",
    contentType: "multipart/form-data",
  });

const useGetAccommodation = (id) => useApi({ url: `accommodation/${id}` });

const useDeleteAccommodation = (id) =>
  useApi({
    url: `accommodation/${id}`,
    method: "delete",
  });

const requestAccommodation = () =>
  useApi({
    url: `accommodationrequest`,
    method: "post",
  });

const useDeleteAccommodationRequests = (id) =>
  useApi({
    url: `accommodationrequest/${id}`,
    method: "delete",
  });

const useUpdateAccommodationRequests = (id, status) =>
  useApi({
    url: `accommodationrequest/${id}`,
    method: "patch",
    body: {
      status,
    },
  });

const useGetAccommodationRequests = (id) =>
  useApi({ url: `accommodation/${id}/requests?page=1&limit=1000000000` });

const useGetAllAccommodationsOnMap = (blLng, blLat, trLng, trLat) =>
  useApi({
    url: `accommodation/map?blLng=${blLng}&blLat=${blLat}&trLng=${trLng}&trLat=${trLat}`,
  });

const useGetNearbyAccommodations = (lat, lng) => {
  return useApi({
    url: `accommodation/near?longitude=${lng}&latitude=${lat}&maxDistance=10000`,
  });
};

export {
  useGetAllAccommodations,
  useCreateAccommodation,
  useGetAccommodation,
  requestAccommodation,
  useGetAccommodationRequests,
  useDeleteAccommodation,
  useDeleteAccommodationRequests,
  useUpdateAccommodationRequests,
  useGetAllAccommodationsOnMap,
  useGetNearbyAccommodations,
};

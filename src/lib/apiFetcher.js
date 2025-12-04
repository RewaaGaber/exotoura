import api from "./api";

const apiFetcher = async ({ 
  url = "", 
  method = "get", 
  data = null,
  contentType = "application/json" 
}) => {
  const response = await api.request({
    url,
    method,
    data,
    headers: {
      'Content-Type': contentType
    }
  });
  return response.data;
};

export default apiFetcher;

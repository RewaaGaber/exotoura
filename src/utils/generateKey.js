export const generateKey = ({ url, method = "get", body = null }) => {
  const isGet = method.toLowerCase() === "get";

  const bodyStr = body ? JSON.stringify(body) : "";

  return isGet ? `${method}:${url}:${bodyStr}` : `${method.toLowerCase()}:${url}`;
};

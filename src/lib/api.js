import axios from "axios";

let accessToken = null;
let refreshRequest = null;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = api
      .post("/auth/refresh-token", null, { skipRefresh: true })
      .then((response) => {
        const token = responseData(response)?.token;
        if (!token) throw new Error("Refresh response did not contain an access token");
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const shouldRefresh =
      error.response?.status === 401 &&
      request &&
      !request.skipRefresh &&
      !request.url?.includes("/auth/refresh-token");

    if (!shouldRefresh || request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      const token = await refreshAccessToken();
      request.headers = { ...request.headers, Authorization: `Bearer ${token}` };
      return api(request);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  }
);

export function responseData(response) {
  return response.data?.data ?? response.data;
}

export default api;

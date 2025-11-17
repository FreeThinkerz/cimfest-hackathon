import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function saveAccessToken(token: string) {
  localStorage.setItem("access_token", token);
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedRequestQueue: any[] = [];

async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refresh_token: refresh,
  });

  const newToken = response.data?.access_token;
  if (!newToken) throw new Error("Refresh failed");

  saveAccessToken(newToken);
  return newToken;
}

apiClient.interceptors.response.use(
  (response) => response.data, // extract `data`
  
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // If unauthorized (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Already refreshing → queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            resolve,
            reject,
          });
        })
          .then((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      // Not refreshing → refresh now
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        // Run queued requests
        failedRequestQueue.forEach((req) => req.resolve(newToken));
        failedRequestQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        failedRequestQueue.forEach((req) => req.reject(err));
        failedRequestQueue = [];

        // Refresh failed → redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };


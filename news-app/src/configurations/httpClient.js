import axios from "axios";
import { CONFIG } from "./configuration";
import { refreshToken } from "../services/userService";
import { getToken, setToken, removeToken } from "../services/localStorageService";

const httpClient = axios.create({
  baseURL: CONFIG.API_GATEWAY,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach token vào mỗi request
httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      if(error.response?.status === 429) {
        alert("Too many requests. Please try again later.");
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const oldToken = getToken();
        const res = await refreshToken(oldToken);

        const newToken = res?.data?.result?.token;

        if (!newToken) throw new Error("No new token received");

        setToken(newToken);

        httpClient.defaults.headers.common.Authorization = "Bearer " + newToken;
        processQueue(null, newToken);
        return httpClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        removeToken();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;

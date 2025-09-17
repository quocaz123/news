import httpClient from "../configurations/httpClient";
import { API_USER } from "../configurations/configuration";

export const login = async (username, password) => {
    return await httpClient.post(API_USER.LOGIN, { username, password });
    
}

export const logout = async (token) => {
    return await httpClient.post(API_USER.LOGOUT, { token });
}

export const register = async (email, password) => {
    return await httpClient.post(API_USER.REGISTER, { email, password });
}


export const refreshToken = async (token) => {
  console.log("🚀 Refresh token sent:", token);
  try {
    const res = await httpClient.post(API_USER.REFRESH_TOKEN, { token });
    console.log("✅ Refresh token response:", res.data);
    return res; // Trả nguyên response để interceptor xử lý
  } catch (err) {
    console.error("❌ Refresh token error:", err.response?.data || err);
    throw err;
  }
};
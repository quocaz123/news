export const KEY_TOKEN = "accessToken";

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
} 

export const removeToken = () => {
  localStorage.removeItem(KEY_TOKEN);
}
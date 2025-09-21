import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

export const searchByTitle = async (title, page = 1, size = 12) => {
  return await httpClient.get(`${API.SEARCH}`, {
    params: { title, page, size }
  });
};

export const searchByCategory = async (categoryName, page = 1, size = 12) => {
  return await httpClient.get(`${API.SEARCH_CATEGORY}`, {
    params: { categoryName, page, size }
  });
};




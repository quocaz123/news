import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

// User Management APIs
export const getUsers = async () => {
    return await httpClient.get(API.ADMIN_USERS, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const getUserById = async (id) => {
    return await httpClient.get(API.ADMIN_USER_BY_ID(id), {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const updateUser = async (id, userData) => {
    return await httpClient.put(API.ADMIN_USER_BY_ID(id), userData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const deleteUser = async (id) => {
    return await httpClient.delete(API.ADMIN_USER_BY_ID(id), {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

// Role Management APIs
export const getRoles = async () => {
    return await httpClient.get(API.ADMIN_ROLES, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const createRole = async (roleData) => {
    return await httpClient.post(API.ADMIN_ROLES, roleData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const deleteRole = async (roleName) => {
    return await httpClient.delete(`${API.ADMIN_ROLES}/${roleName}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

// Category Management APIs
export const getCategories = async () => {
    return await httpClient.get(API.ADMIN_CATEGORIES, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const getCategoryById = async (id) => {
    return await httpClient.get(API.ADMIN_CATEGORY_BY_ID(id), {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const createCategory = async (categoryData) => {
    return await httpClient.post(API.ADMIN_CATEGORIES, categoryData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const updateCategory = async (id, categoryData) => {
    return await httpClient.put(API.ADMIN_CATEGORY_BY_ID(id), categoryData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const deleteCategory = async (id) => {
    return await httpClient.delete(API.ADMIN_CATEGORY_BY_ID(id), {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

// Post Management APIs (Admin view)
export const getAllPosts = async (page = 1, size = 10) => {
    return await httpClient.get(API.ADMIN_ALL_POSTS, {
        params: { page, size },
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const getPostById = async (id) => {
    return await httpClient.get(API.PUBLISH_POST_BY_ID(id), {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

// Admin Stats API
export const getAdminStats = async () => {
    return await httpClient.get(API.DASHBOARD_STATS, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

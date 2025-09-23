import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";


export const getCategories = async () => {
    return await httpClient.get(API.CATEGORIES);
}

export const getPublishedPosts = async (page = 1, size = 12) => {
    return await httpClient.get(API.PUBLISH_POST, {
        params: { page, size }
    });
}

// Lấy tất cả bài viết (cho admin)
export const getAllPosts = async (page = 1, size = 10) => {
    return await httpClient.get(API.ADMIN_ALL_POSTS, {
        params: { page, size },
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
}

// Lấy bài viết theo danh mục
export const getPostsByCategory = async (categoryId, page = 1, size = 12) => {
    return await httpClient.get(API.SEARCH_CATEGORY, {
        params: { categoryId, page, size }
    });
}

// Tìm kiếm bài viết theo tiêu đề
export const searchPosts = async (query, page = 1, size = 12) => {
    return await httpClient.get(API.SEARCH, {
        params: { query, page, size }
    });
}

// Lấy bài viết mới nhất
export const getLatestPosts = async (page = 1, size = 12) => {
    return await httpClient.get(API.SEARCH_LATEST, {
        params: { page, size }
    });
}

export const getPublishedPostById = async (id) => {
    return await httpClient.get(API.PUBLISH_POST_BY_ID(id));
}

export const getMyPosts = async (page = 1, limit = 10) => {
    return await httpClient.get(API.MY_POSTS, {
        params: { page, limit },
        headers: {
            Authorization: `Bearer ${getToken()}`, // Dùng token từ localStorage/sessionStorage
        },
    });
};

export const createPost = async (postData, file) => {
    const formData = new FormData();

    // Append JSON string cho post
    formData.append("post", JSON.stringify(postData));

    // Append file nếu có
    if (file) {
        formData.append("file", file);
    }

    return await httpClient.post(API.CREATE_POST, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updatePost = async (id, postData, file) => {
    const formData = new FormData();

    formData.append("post", JSON.stringify(postData));

    // Append file nếu có
    if (file) {
        formData.append("file", file);
    }

    return await httpClient.put(API.UPDATE_POST(id), formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
        },
    });
}



export const deletePost = async (id) => {
    return await httpClient.delete(API.DELETE_POST(id), {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const likePost = async (id) => {
    return await httpClient.post(API.LIKE_POST(id), {}, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const dislikePost = async (id) => {
    return await httpClient.post(API.DISLIKE_POST(id), {}, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const getDashboardStats = async () => {
    return await httpClient.get(API.DASHBOARD_STATS, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
}

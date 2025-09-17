import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";


export const getCategories = async () => {
    return await httpClient.get(API.CATEGORIES);
}

export const getPublishedPosts = async (page = 1, size = 12) => {
    return await httpClient.get(API.PUBLISH_POST, {
        params: { page, size }});
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

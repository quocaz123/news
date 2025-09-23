export const CONFIG = {
  API_GATEWAY: 'http://localhost:8888/api/v1',
};

export const API = {
  PUBLISH_POST: '/post/internal/publish',
  PUBLISH_POST_BY_ID: (id) => `/post/internal/publish/${id}`,
  CATEGORIES: '/post/categories',
  MY_POSTS: '/post/my-posts',
  CREATE_POST: '/post/create',
  UPDATE_POST: (id) => `/post/${id}`,
  DELETE_POST: (id) => `/post/${id}`,
  LIKE_POST: (id) => `/post/${id}/reactions/like`,
  DISLIKE_POST: (id) => `/post/${id}/reactions/dislike`,
  // Search service endpoints
  SEARCH: '/search/search/title',
  SEARCH_LATEST: '/search/latest',
  SEARCH_CATEGORY: '/search/search/category',
  DASHBOARD_STATS: '/post/dashboard/stats',
  // Admin APIs
  ADMIN_USERS: '/identity/users',
  ADMIN_USER_BY_ID: (id) => `/identity/users/${id}`,
  ADMIN_ROLES: '/identity/roles',
  ADMIN_CATEGORIES: '/post/categories',
  ADMIN_CATEGORY_BY_ID: (id) => `/post/categories/${id}`,
  ADMIN_ALL_POSTS: '/post/internal/publish', // For admin to see all posts
};

export const API_USER = {
  LOGIN: '/identity/auth/token',
  LOGOUT: '/identity/auth/logout',
  REGISTER: '/identity/auth/register',
  REFRESH_TOKEN: '/identity/auth/refresh',
};

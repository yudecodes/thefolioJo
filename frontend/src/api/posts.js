// frontend/src/api/posts.js
import API from './axios';

export const getAllPosts  = ()           => API.get('/posts').then(r => r.data);
export const createPost  = (formData)   => API.post('/posts', formData).then(r => r.data);
export const deletePost  = (id)         => API.delete(`/posts/${id}`).then(r => r.data);
export const updatePost  = (id, data)   => API.put(`/posts/${id}`, data).then(r => r.data); // 👈 new

export const getComments = (postId)     => API.get(`/comments/${postId}`).then(r => r.data);
export const addComment  = (postId, text) => API.post(`/comments/${postId}`, { text }).then(r => r.data);
export const deleteComment = (id)       => API.delete(`/comments/${id}`).then(r => r.data);
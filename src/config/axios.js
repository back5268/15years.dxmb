// src/api/axiosClient.js
import axios from 'axios';

// Tạo instance mặc định
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_URL, // 👈 URL API chính
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout
});

// ✅ Interceptor REQUEST (nếu cần gắn token, v.v.)
axiosClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Interceptor RESPONSE
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Xử lý lỗi chung
        if (error.response) {
            console.error('API Error:', error.response);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;

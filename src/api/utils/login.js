import axiosClient from "../../config/axios";

export const loginApi = params => axiosClient.post('/api/register', params);
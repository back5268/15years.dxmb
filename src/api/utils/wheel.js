import axiosClient from "../../config/axios";

export const spinApi = params => axiosClient.post('/api/spin', params);
export const getPrizeApi = params => axiosClient.get('/api/prizes', {params})
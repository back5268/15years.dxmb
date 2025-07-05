import axiosClient from "../config/axios";

const wheelApi = {
    spin: (params) => axiosClient.post('/api/spin', params),
    getPrizes: (params) => axiosClient.get('/api/prizes', {
        params: params
    })
};

export default wheelApi
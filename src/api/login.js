import axiosClient from "../config/axios";

const authApi = {
    login: (params) => axiosClient.post('/api/prizes', {
        params
    }),
};

export default authApi
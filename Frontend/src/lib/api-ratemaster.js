import axios from "axios";
import { RATEMASTER_BASE_PATH } from "./api-base-path";

export const getallRateMasters = (page, pageSize, search) => {
    console.log(page, pageSize, search)
    return axios.get(`${RATEMASTER_BASE_PATH}/getallRateMasters`, {
        params: {
            page,
            pageSize,
            search
        }
    });
};

export const AddRateMasters = (data) => {
    return axios.post(`${RATEMASTER_BASE_PATH}/AddRateMaster`, data);
};


export const getRateMasterbyid = (id) => {
    console.log(id)
    return axios.get(`${RATEMASTER_BASE_PATH}/getRateMasterbyid/${id}`);
};

export const UpdateRateMaster = (id, data) => {
    
    return axios.put(`${RATEMASTER_BASE_PATH}/UpdateRateMaster/${id}`, data);
};
export const deleteratemaster = (id) => {

    return axios.delete(`${RATEMASTER_BASE_PATH}/deleteratemaster/${id}`);
};



import axios from "axios";
import { DRIVER_BASE_PATH } from "./api-base-path";


export const getAllDriver = (page, pageSize, search) => {
    console.log(page, pageSize, search)
    return axios.get(`${DRIVER_BASE_PATH}/getAllDriver`, {
        params: {
            page,
            pageSize,
            search
        }
    });
};
export const getAllDrivers = () => {
    
    return axios.get(`${DRIVER_BASE_PATH}/getAllDrivers`);
};

export const Adddriver = (data) => {
    return axios.post(`${DRIVER_BASE_PATH}/Adddriver`, data);
};


export const getDriverbyid = (id) => {
    return axios.get(`${DRIVER_BASE_PATH}/getDriverbyid/${id}`);
};

export const updatedrivers = (id, data) => {
    
    return axios.put(`${DRIVER_BASE_PATH}/UpdateDriver/${id}`, data);
};
export const deletedriver = (id) => {

    return axios.delete(`${DRIVER_BASE_PATH}/deletedriver/${id}`);
};



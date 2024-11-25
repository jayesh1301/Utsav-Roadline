import axios from "axios";
import { VEHICLE_BASE_PATH } from "./api-base-path";


export const getallVehicles = (page, pageSize, search,branch) => {
    
    return axios.get(`${VEHICLE_BASE_PATH}/getallVehicles`, {
        params: {
            page,
            pageSize,
            search,
            branch
        }
    });
};
export const getallVehicle = () => {
    
    return axios.get(`${VEHICLE_BASE_PATH}/getallVehicle`);
};
export const deletevehicle = (id) => {

    return axios.delete(`${VEHICLE_BASE_PATH}/deletevehicle/${id}`);
};

export const AddVehicles = (data) => {
    return axios.post(`${VEHICLE_BASE_PATH}/AddVehicle`, data);
};

export const getVehiclebyid = (id) => {
    return axios.get(`${VEHICLE_BASE_PATH}/getVehiclebyid/${id}`);
};

export const UpdateVehicles = (id, data,branch) => {
    return axios.put(`${VEHICLE_BASE_PATH}/UpdateVehicle/${id}/${branch}`, data);
};
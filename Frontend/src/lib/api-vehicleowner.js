import axios from "axios";
import { VEHICLEOWNER_BASE_PATH } from "./api-base-path";


export const getallVehicleOwener = () => {
    
    return axios.get(`${VEHICLEOWNER_BASE_PATH}/getallVehicleOwener`)
};
export const getallVehicleOweners = (page,pageSize,search) => {
    
    return axios.get(`${VEHICLEOWNER_BASE_PATH}/getallVehicleOweners`, {
        params: {
            page,
            pageSize,
            search
        }
    });
};

export const AddVehicleOwener = (data) => {
    return axios.post(`${VEHICLEOWNER_BASE_PATH}/AddVehicleOwener`, data);
};

export const getVehicleOwenerbyid = (id) => {
    return axios.get(`${VEHICLEOWNER_BASE_PATH}/getVehicleOwenerbyid/${id}`)
};

export const UpdateVehicleOwener = (id, data) => {
    console.log("libs",data)
    return axios.put(`${VEHICLEOWNER_BASE_PATH}/UpdateVehicleOwener/${id}`, data);
};

export const deletevehicleowner = (id) => {

    return axios.delete(`${VEHICLEOWNER_BASE_PATH}/deletevehicleowner/${id}`);
};

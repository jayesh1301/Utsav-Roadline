import axios from "axios";
import { TYRESUPPLIER_BASE_PATH } from "./api-base-path";


export const getallVehicleOwener = () => {
    
    return axios.get(`${TYRESUPPLIER_BASE_PATH}/getallVehicleOwener`)
};


export const getalltyresupplierss = (page,pageSize,search) => {
    
    return axios.get(`${TYRESUPPLIER_BASE_PATH}/getalltyresupplierss`, {
        params: {
            page,
            pageSize,
            search
        }
    });
};

export const addtyresupplier = (data) => {
    return axios.post(`${TYRESUPPLIER_BASE_PATH}/addtyresupplier`, data);
};

export const gettyresupplierbyid = (id) => {
    return axios.get(`${TYRESUPPLIER_BASE_PATH}/gettyresupplierbyid/${id}`)
};

export const updatetyresuppliers = (id, data) => {
    
    return axios.put(`${TYRESUPPLIER_BASE_PATH}/updatetyresuppliers/${id}`, data);
};

export const deletetyresupplier = (id) => {

    return axios.delete(`${TYRESUPPLIER_BASE_PATH}/deletetyresupplier/${id}`);
};

import axios from "axios";
import { PLACE_BASE_PATH } from "./api-base-path";


export const getAllPlace = (page, pageSize, search) => {
    return axios.get(`${PLACE_BASE_PATH}/getAllPlace`, {
        params: {
            page,
            pageSize,
            search
        }
    });
};
export const getAllPlaces = () => {
    return axios.get(`${PLACE_BASE_PATH}/getAllPlaces`);
};

export const AddPlaces = (data) => {
    return axios.post(`${PLACE_BASE_PATH}/addPlace`, data);
};


export const getPlacebyid = (id, controller) => {
    return axios.get(`${PLACE_BASE_PATH}/getPlacebyid/${id}`, {
        signal: controller?.signal,
    });
};

export const UpadtePlace = (id, data) => {
    return axios.put(`${PLACE_BASE_PATH}/UpadtePlace/${id}`, data);
};
export const deletePlace = (id) => {

    return axios.delete(`${PLACE_BASE_PATH}/deletePlace/${id}`);
};

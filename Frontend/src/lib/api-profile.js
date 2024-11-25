import axios from "axios";
import { PROFILE } from "./api-base-path";

export const getprofile = () => {
    
    return axios.get(`${PROFILE}/getprofile`, {
    });
};
export const getprofilebyid = (id) => {
    
    return axios.get(`${PROFILE}/getprofilebyid/${id}`, {
    });
};

export const UpadteProfile = (id, data) => {
    console.log(id,data)
    return axios.put(`${PROFILE}/UpadteProfile/${id}`, data);
};




import axios from "axios";
import { PETROLPUMP_BASE_PATH } from "./api-base-path";

export const insertpetrolpump = (data) => {
    console.log("hiii", data);
    return axios.post(`${PETROLPUMP_BASE_PATH}/insertpetrolpump`, data);
  };

  
  export const getallpetrolpumps = (page, pageSize,search) => {
    return axios.get(`${PETROLPUMP_BASE_PATH}/getallpetrolpumps`, {
        params: {
          page,
          pageSize,
          search
        }
      });
    };

    export const deletepetrolpump = (id) => {
      console.log("delete", id);
      return axios.delete(`${PETROLPUMP_BASE_PATH}/deletepetrolpump/${id}`);
    };

    export const getpetrolpumpbyid = ( id) => {
      return axios.get(`${PETROLPUMP_BASE_PATH}/getpetrolpumpbyid/${id}`, {
      
      });
    };
    
  export const updatepetrolpump = (id, data, controller) => {
    return axios.put(`${PETROLPUMP_BASE_PATH}/updatepetrolpump/${id}`, data);
  };
  
    
  
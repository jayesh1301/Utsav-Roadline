import axios from "axios";
import { BANK_BASE_PATH } from "./api-base-path";



  
export const getAllBanks = (page, pageSize,search) => {
  return axios.get(`${BANK_BASE_PATH}/getAllBanks`, {
      params: {
        page,
        pageSize,
        search
      }
    });
  };

  export const UpadteBank = (id, data) => {
    console.log(id,data)
    return axios.put(`${BANK_BASE_PATH}/UpadteBank/${id}`, data);
};

  export const addbank = (data) => {
    console.log("hiii", data);
    return axios.post(`${BANK_BASE_PATH}/addbank`, data);
  };
  
  export const deletebank = (id) => {
    console.log("delete",id)
     return axios.delete(`${BANK_BASE_PATH}/deletebank/${id}`);
   };
   export const getBankbyid = (id, controller) => {
    return axios.get(`${BANK_BASE_PATH}/getBankbyid/${id}`, {
        signal: controller?.signal,
    });
};
 
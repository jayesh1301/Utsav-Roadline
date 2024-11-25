import axios from "axios";
import { ARTICAL_BASE_PATH } from "./api-base-path";

export const AddArtical = (data) => {

  return axios.post(`${ARTICAL_BASE_PATH}/addArtical`, data);
};

export const AddEmail = (data) => {
  console.log("hiii", data);
  return axios.post(`${ARTICAL_BASE_PATH}/addemail`, data);
};

  
export const getArtical = (page, pageSize,search) => {
  return axios.get(`${ARTICAL_BASE_PATH}/getArtical`, {
      params: {
        page,
        pageSize,
        search
      }
    });
  };
  export const getEmail = (page, pageSize,search) => {
    return axios.get(`${ARTICAL_BASE_PATH}/getEmail`, {
        params: {
          page,
          pageSize,
          search
        }
      });
    };
  
  export const getArticals = () => {
    return axios.get(`${ARTICAL_BASE_PATH}/getArticals`);
    };
export const getArticalbyid = ( id,controller) => {
    return axios.get(`${ARTICAL_BASE_PATH}/getArticalbyid/${id}`, {
      signal: controller?.signal,
    });
  };
  export const getEmailbyid = ( id,controller) => {
    return axios.get(`${ARTICAL_BASE_PATH}/getEmailbyid/${id}`, {
      signal: controller?.signal,
    });
  };
  
export const UpadteArtical = (id, data, controller) => {
  return axios.put(`${ARTICAL_BASE_PATH}/UpadteArtical/${id}`, data);
};
export const UpadteEmail = (id, data, controller) => {
  return axios.put(`${ARTICAL_BASE_PATH}/UpadteEmail/${id}`, data);
};


export const deleteArtical = (id) => {
   console.log("delete",id)
    return axios.delete(`${ARTICAL_BASE_PATH}/deleteArtical/${id}`);
  };
  export const deleteEmail = (id) => {
   
     return axios.delete(`${ARTICAL_BASE_PATH}/deleteEmail/${id}`);
   };
   
  

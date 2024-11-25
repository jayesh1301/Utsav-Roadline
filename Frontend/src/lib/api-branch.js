import axios from "axios";
import { BRANCH_BASE_PATH, PLACE_BASE_PATH } from "./api-base-path";



  
export const getAllBranch = (page, pageSize,search) => {
  return axios.get(`${BRANCH_BASE_PATH}/getAllBranches`, {
      params: {
        page,
        pageSize,
        search
      }
    });
  };
  export const SelectBranch = () => {
    return axios.get(`${BRANCH_BASE_PATH}/SelectBranch`);
    };


export const getAllPlaces = () => {
    return axios.get(`${PLACE_BASE_PATH}/getAllPlaces`);
  };
  
  export const AddBranch = (data) => {
    console.log("hiii", data);
    return axios.post(`${BRANCH_BASE_PATH}/addBranch`, data);
  };
  
  export const deleteBranch = (id) => {
    console.log("delete",id)
     return axios.delete(`${BRANCH_BASE_PATH}/deleteBranch/${id}`);
   };
   export const getBranchbyid = (id) => {
    console.log(id)
    return axios.get(`${BRANCH_BASE_PATH}/getBranchbyid/${id}`, {
      
    });
};
 

export const UpadteBranch = (id, data,) => {
  return axios.put(`${BRANCH_BASE_PATH}/upadteBranch/${id}`, data);
};

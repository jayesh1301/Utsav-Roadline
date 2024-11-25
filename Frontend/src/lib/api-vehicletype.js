import axios from "axios";
import { VEHICLETYPE_BASE_PATH } from "./api-base-path";

export const getallvehicletypes = (page,pageSize,search) => {
    console.log(search)
  return axios.get(`${VEHICLETYPE_BASE_PATH}/getallvehicletypes`, {
    params: {
      page,
        pageSize,
      search,
    },
  });
};
export const getallvehicletype = () => {
  
return axios.get(`${VEHICLETYPE_BASE_PATH}/getallvehicletype`);
};

export const deleteVehicleType = (id) => {
  console.log("delete", id);
  return axios.delete(`${VEHICLETYPE_BASE_PATH}/deletevehicletype/${id}`);
};

export const AddVehicleType = (data) => {
  console.log("hiii", data);
  return axios.post(`${VEHICLETYPE_BASE_PATH}/addvehicletype`, data);
};

export const getvehicletypebyid = (id) => {
  return axios.get(`${VEHICLETYPE_BASE_PATH}/getvehicletypebyid/${id}`, {});
};

export const updatevehicletype = (id, data, controller) => {
  return axios.put(`${VEHICLETYPE_BASE_PATH}/updatevehicletype/${id}`, data);
};

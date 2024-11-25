import axios from "axios";
import {
  BRANCH_BASE_PATH,
  CUSTOMER_BASE_PATH,
  PLACE_BASE_PATH,
} from "./api-base-path";

export const getAllCustomer = (page, pageSize, search) => {
  console.log("Search parameter:", search);
  return axios.get(`${CUSTOMER_BASE_PATH}/getAllCustomer`, {
    params: {
      page,
      pageSize,
      search,
    },
  });
};

export const getAllCustomers = () => {
  return axios.get(`${CUSTOMER_BASE_PATH}/getAllCustomers`);
};

export const SelectBranch = () => {
  return axios.get(`${BRANCH_BASE_PATH}/SelectBranch`);
};

export const getAllPlaces = () => {
  return axios.get(`${PLACE_BASE_PATH}/getAllPlaces`);
};

export const AddCustomer = (data) => {
  console.log("hiii", data);
  return axios.post(`${CUSTOMER_BASE_PATH}/AddCustomer`, data);
};

export const deleteCustomer = (id) => {
  console.log("delete", id);
  return axios.delete(`${CUSTOMER_BASE_PATH}/deletecustomer/${id}`);
};

export const getCustomerbyid = (id) => {
  console.log(id);
  return axios.get(`${CUSTOMER_BASE_PATH}/getCustomerbyid/${id}`);
};

export const UpadteCustomer = (id, data) => {
  return axios.put(`${CUSTOMER_BASE_PATH}/UpadteCustomer/${id}`, data);
};

export const deleteContactPerson = (id) => {
  console.log("delete", id);
  return axios.delete(`${CUSTOMER_BASE_PATH}/deleteContactPerson/${id}`);
};

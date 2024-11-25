import axios from "axios";
import { BANK_ACCOUNT_LIST_BASE_PATH, BANK_BASE_PATH } from "./api-base-path";

export const getAllBanksAcc = (page, pageSize, search) => {

  return axios.get(`${BANK_ACCOUNT_LIST_BASE_PATH}/getAllBanksAcc`, {
    params: {
      page,
      pageSize,
      search,
    },
  });
};

export const SelectBank = () => {
  return axios.get(`${BANK_BASE_PATH}/SelectBank`);
};

export const AddBankacc = (data) => {
  console.log("hiii", data);
  return axios.post(`${BANK_ACCOUNT_LIST_BASE_PATH}/addbankacc`, data);
};
export const getBankAccbyid = (id) => {
  return axios.get(`${BANK_ACCOUNT_LIST_BASE_PATH}/getBankAccbyid/${id}`, {
   
  });
};

export const UpadteBankAcc = (id, data) => {
  return axios.put(`${BANK_ACCOUNT_LIST_BASE_PATH}/UpadteBankAcc/${id}`, data);
};
export const deletebankacc = (id) => {
  console.log("delete",id)
   return axios.delete(`${BANK_ACCOUNT_LIST_BASE_PATH}/deletebankacc/${id}`);
 };
 





  
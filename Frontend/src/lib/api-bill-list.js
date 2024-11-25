import axios from 'axios';
import { BILL_LIST_BASE_PATH, BRANCH_BASE_PATH } from './api-base-path';


export const SelectBranch = () => {
    return axios.get(`${BRANCH_BASE_PATH}/SelectBranch`);
  };


  export const getbillsbybranch = (branch,page, pageSize) => {

    return axios.get(`${BILL_LIST_BASE_PATH}/getbillsbybranch/${branch}`,{
        params: {
          page,
          pageSize,
          
        }
      })
  };

  export const searchBills = (bill_no, cust_id, branch ) => {

    return axios.get(`${BILL_LIST_BASE_PATH}/searchBills`, {
        params: {
          bill_no, cust_id,branch
        }
    });;
};

export const getLorryMasterListForBill = (in_cust, in_billtype) => {
  console.log(in_cust, in_billtype)

  return axios.get(`${BILL_LIST_BASE_PATH}/getLorryMasterListForBill`, {
      params: {
        in_cust, in_billtype
      }
  });;
};

export const getlrdetailsbyid = (in_id, in_cust) => {
  console.log(in_id, in_cust)

  return axios.get(`${BILL_LIST_BASE_PATH}/getlrdetailsbyid`, {
      params: {
         in_cust,
         in_id
      }
  });;
};
   

export const Aaddbillmasterddlr = (data) => {
  return axios.post(`${BILL_LIST_BASE_PATH}/addbillmaster`, data);
};


export const getbillbyid = (id) => {
  console.log(id)
  return axios.get(`${BILL_LIST_BASE_PATH}/getbillbyid/${id}`, {
     
  });
};

export const updateBill = (id, data) => {
  console.log(id)
  return axios.put(`${BILL_LIST_BASE_PATH}/updateBill/${id}`, data);
};

export const deletebills = (id) => {
  console.log("delete",id)
   return axios.delete(`${BILL_LIST_BASE_PATH}/deletebills/${id}`);
 };
 
 export const billforprint = (id) => {
  console.log(id)
  return axios.get(`${BILL_LIST_BASE_PATH}/billforprint/${id}`, {
     
  });
};

export const billforExcel = (id) => {
  console.log(id)
  return axios.get(`${BILL_LIST_BASE_PATH}/billforExcel/${id}`, {
     
  });
};
   
export const mailbill = (id) => {
  console.log(id)
  return axios.get(`${BILL_LIST_BASE_PATH}/mailBill/${id}`, {
     
  });
};


export const sendMail = (options) => {
  return axios.post(`${BILL_LIST_BASE_PATH}/sendMail`,options);
};
   
export const getLorryMasterListForBillUpdate = (in_cust, in_billtype) => {
  console.log(in_cust, in_billtype)

  return axios.get(`${BILL_LIST_BASE_PATH}/getLorryMasterListForBillUpdate`, {
      params: {
        in_cust, in_billtype
      }
  });;
};
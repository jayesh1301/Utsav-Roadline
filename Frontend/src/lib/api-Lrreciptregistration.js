import axios from "axios";
import { LORRY_RECEIPT_REGISTER } from "./api-base-path";

export const getlrlistforreportbydate = (
  branch,
  formattedFromDate,
  formattedToDate,
  page,
  pageSize,
  search ,
  consignor,
  paymentMode,

) => {

  return axios.get(
    `${LORRY_RECEIPT_REGISTER}/getlrlistforreportbydate/${branch}`,
    {
      params: {
        formattedFromDate,
        formattedToDate,
        page,
        pageSize,
        search,
        consignor,
        paymentMode, 
    
      },
    }
  );
};

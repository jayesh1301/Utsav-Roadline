import axios from "axios";
import { BILL_REPORT } from "./api-base-path";

export const getBillreports = (
  branch,
  formattedFromDate,
  formattedToDate,
  page,
  pageSize,
  search,
  consignor,
  lrNo,
) => {
console.log(lrNo)
  return axios.get(
    `${BILL_REPORT}/getbilllistforreportbydate/${branch}`,
    {
      params: {
        formattedFromDate,
        formattedToDate,
        page,
        pageSize,
        search,
        consignor,
        lrNo,
      },
    }
  );
};

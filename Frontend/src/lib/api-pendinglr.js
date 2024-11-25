import axios from "axios";
import { PENDINGLR_BASE_PATH } from "./api-base-path";

export const getpendinglrlistforreportbydefault = (
  branch,
  page,
  pageSize,
  search,
  consignor,
  consignee
) => {
  return axios.get(
    `${PENDINGLR_BASE_PATH}/getpendinglrlistforreportbydefault/${branch}`,
    {
      params: {
        page,
        pageSize,
        search,
        consignor,
        consignee,
      },
    }
  );
};

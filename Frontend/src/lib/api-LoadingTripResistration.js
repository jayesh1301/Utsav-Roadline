import axios from "axios";
import { LOADING_TRIP_REGISTER } from "./api-base-path";

export const getlslistforreportbydate = (
  branch,
  formattedFromDate,
  formattedToDate,
  page,
  pageSize,
  value
) => {

  return axios.get(
    `${LOADING_TRIP_REGISTER}/getlslistforreportbydate/${branch}`,
    {
      params: {
        formattedFromDate,
        formattedToDate,
        page,
        pageSize,
        value
      },
    }
  );
};
export const getlslistforreportbydatesearch = (
  branch,
  formattedFromDate,
  formattedToDate,
  page,
  pageSize,
  search ,
  lrno,
  selectedVehicleOwner

) => {
console.log(selectedVehicleOwner)
  return axios.get(
    `${LOADING_TRIP_REGISTER}/getlslistforreportbydatesearch/${branch}`,
    {
      params: {
        formattedFromDate,
        formattedToDate,
        page,
        pageSize,
        search,
      
        lrno,
        selectedVehicleOwner
      },
    }
  );
};

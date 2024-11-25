 //export const APP_BASE_PATH = import.meta.env.VITE_APP_BASE_PATH
 console.log("env.js loaded");
 export const APP_BASE_PATH = window.env.VITE_APP_BASE_PATH
 console.log("APP_BASE_PATH",APP_BASE_PATH);
//export const APP_BASE_PATH = "https://rajesh.api.cloudbin.in/"
  //export const APP_BASE_PATH = "http://localhost:4000/"

export const LOGIN_BASE_PATH = `${APP_BASE_PATH}api/login`;
export const USERS_BASE_PATH = `${APP_BASE_PATH}api/user`;
export const ARTICAL_BASE_PATH = `${APP_BASE_PATH}api/artical`;
export const PLACE_BASE_PATH = `${APP_BASE_PATH}api/place`;
export const BRANCH_BASE_PATH = `${APP_BASE_PATH}api/branch`;
export const EMPLOYEE_BASE_PATH = `${APP_BASE_PATH}api/employee`;
export const BANK_BASE_PATH = `${APP_BASE_PATH}api/banks`;
export const BANK_ACCOUNT_LIST_BASE_PATH = `${APP_BASE_PATH}api/bankacc`;
export const CUSTOMER_BASE_PATH = `${APP_BASE_PATH}api/customer`;
export const DRIVER_BASE_PATH = `${APP_BASE_PATH}api/driver`;
export const VEHICLE_BASE_PATH = `${APP_BASE_PATH}api/vehicle`;
export const VEHICLETYPE_BASE_PATH = `${APP_BASE_PATH}api/vehicletype`;
export const VEHICLEOWNER_BASE_PATH = `${APP_BASE_PATH}api/vehicleowener`;
export const TYRESUPPLIER_BASE_PATH = `${APP_BASE_PATH}api/tyresupplier`;
export const LORRYRECEIPT_BASE_PATH = `${APP_BASE_PATH}api/lr`;
export const RATEMASTER_BASE_PATH = `${APP_BASE_PATH}api/ratemasterlist`;
export const PETROLPUMP_BASE_PATH = `${APP_BASE_PATH}api/petrolpump`;
export const BILL_LIST_BASE_PATH = `${APP_BASE_PATH}api/bills`;
export const LOADINGTRIP_BASE_PATH = `${APP_BASE_PATH}api/loadingtrip`;
export const PENDINGLR_BASE_PATH = `${APP_BASE_PATH}api/pendinglr`;
export const LORRY_RECEIPT_REGISTER = `${APP_BASE_PATH}api/lorryreceiptregister`;
export const LOADING_TRIP_REGISTER = `${APP_BASE_PATH}api/loadingtripregister`;
export const BILL_REPORT = `${APP_BASE_PATH}api/billregister`;
export const PROFILE = `${APP_BASE_PATH}api/Profile`;





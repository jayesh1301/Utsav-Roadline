import axios from "axios";
import { LOADINGTRIP_BASE_PATH } from "./api-base-path";


export const getallLoadingtrip = (branch,page,pageSize) => {
    console.log(branch)
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getallloadingshets/${branch}`, {
        params: {
            page,
            pageSize,
            
        }
    });
};
export const getallItssearch = (branch,in_memo_no,in_vehicle_id,start_index,counts) => {
    console.log(branch)
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getallItssearch/${branch}`, {
        params: {
            in_memo_no,
            in_vehicle_id,
            start_index,
            counts
        }
    });;
};
export const Adddcmaster = (data) => {
    return axios.post(`${LOADINGTRIP_BASE_PATH}/add_dc_master`, data);
};

export const getOweneremail = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getOweneremail/${id}`);
};
export const getlrdetailsforloadsheet = (selectedIds) => {
    console.log(selectedIds)
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getlrdetailsforloadsheet/${selectedIds}`);
};

export const getlrforloadingsheet = (branch) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getlrforloadingsheet/${branch}`);
};
export const getlrforloadingsheetedit = (branch,id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getlrforloadingsheetedit/${branch}/${id}`);
};

export const checklrforupdate = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/checklrforupdate/${id}`);
};
export const getdatas = () => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getdata`);
};

export const getloadingsheetbyid = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getloadingsheetbyid/${id}`);
};
export const getloadingsheetFreightbyid = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getloadingsheetFreightbyid/${id}`);
};
export const getlrdetailsbybranchwise = (id) => {
    console.log(id)
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getlrdetailsbybranchwise/${id}`);
};
export const getlrbyid = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getlrbyid/${id}`);
};
export const getlrbyPrint = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getLRByIdPdfForPrint/${id}`);
};
export const getLRByIdPdfForPrintwithoutvalue = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getLRByIdPdfForPrintwithoutvalue/${id}`);
};
export const saveloadingtripprint = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/saveloadingtripprint/${id}`);
};
export const sendMail = (options) => {
    return axios.post(`${LOADINGTRIP_BASE_PATH}/sendMail`,options);
};
export const getLoadingTripByIdPdfmail = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getLoadingTripByIdPdfmail/${id}`,);
};
export const getLoadingTripByIdPdfedit = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getLoadingTripByIdPdfedit/${id}`,);
};

export const generatelrno = (branch) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/generatelrno/${branch}`);
};

export const Updatedcmaster = (id, data) => {
    
    return axios.put(`${LOADINGTRIP_BASE_PATH}/Updatedcmaster/${id}`, data);
};
export const delete_dc_master = (id) => {
console.log(id)
    return axios.delete(`${LOADINGTRIP_BASE_PATH}/delete_dc_master/${id}`);
};

export const getLRByIdPdf = (id) => {
    return axios.get(`${LOADINGTRIP_BASE_PATH}/getLRByIdPdf/${id}`);
};

import axios from "axios";
import { LORRYRECEIPT_BASE_PATH } from "./api-base-path";


export const getallLr = (branch,page,pageSize) => {
    console.log(branch)
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getallLr/${branch}`, {
        params: {
            page,
            pageSize,
            
        }
    });
};
export const getallLrsearch = (branch,in_lr_no,in_cust_id,start_index,counts) => {
    console.log(branch)
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getallLrsearch/${branch}`, {
        params: {
            in_lr_no,
            in_cust_id,
            start_index,
            counts
        }
    });;
};
export const Addlr = (data) => {
    return axios.post(`${LORRYRECEIPT_BASE_PATH}/addlrmaster`, data);
};


export const checklrforupdate = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/checklrforupdate/${id}`);
};
export const getlrbyid = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getlrbyid/${id}`);
};
export const getlrbyPrint = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getLRByIdPdfForPrint/${id}`);
};
export const getLRByIdPdfForPrintwithoutvalue = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getLRByIdPdfForPrintwithoutvalue/${id}`);
};
export const savelrprint = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/savelrprint/${id}`);
};
export const sendMail = (options) => {
    return axios.post(`${LORRYRECEIPT_BASE_PATH}/sendMail`,options);
};
export const getLRByIdPdfmail = (id) => {
    console.log("id",id)
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getLRByIdPdfmail/${id}`,);
};
export const getemail = () => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getemail`,);
};

export const getConsignor = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getConsignor/${id}`,);
};
export const generatelrno = (branch) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/generatelrno/${branch}`);
};

export const upadtelrmaster = (id, data) => {
    
    return axios.put(`${LORRYRECEIPT_BASE_PATH}/upadtelrmaster/${id}`, data);
};
export const deletelrmaster = (id) => {
console.log(id)
    return axios.delete(`${LORRYRECEIPT_BASE_PATH}/deletelrmaster/${id}`);
};

export const getLRByIdPdf = (id) => {
    return axios.get(`${LORRYRECEIPT_BASE_PATH}/getLRByIdPdf/${id}`);
};

import axios from "axios";
import { EMPLOYEE_BASE_PATH } from "./api-base-path";


export const getallEmployee = () => {

    return axios.get(`${EMPLOYEE_BASE_PATH}/getallEmployee`
        
    );
}
export const getallEmployees = (search) => {

    return axios.get(`${EMPLOYEE_BASE_PATH}/getallEmployees`,{
        params: {
            search
        }
    });
};
export const deleteemployee = (id) => {

    return axios.delete(`${EMPLOYEE_BASE_PATH}/deleteemployee/${id}`);
};

export const AddEmployees = (data) => {
    return axios.post(`${EMPLOYEE_BASE_PATH}/AddEmployee`, data);
};

export const getEmployeebyid = (id) => {
    return axios.get(`${EMPLOYEE_BASE_PATH}/getEmployeebyid/${id}`);
};

export const UpdateEmployees = (id, data) => {
    
    return axios.put(`${EMPLOYEE_BASE_PATH}/UpdateEmployee/${id}`, data);
};
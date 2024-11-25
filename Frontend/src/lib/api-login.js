import axios from 'axios';
import { LOGIN_BASE_PATH } from './api-base-path';




export const UserLogin = (data) => { 
    
    return axios.post(`${LOGIN_BASE_PATH}/login`, data);
  };

 
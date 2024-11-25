import axios from 'axios';
import { USERS_BASE_PATH } from './api-base-path';

 
export const getNewUser = (branch) => {
    
  return axios.get(`${USERS_BASE_PATH}/getNewUser/${branch}`)
};
 
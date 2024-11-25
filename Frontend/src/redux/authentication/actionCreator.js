import Cookies from 'js-cookie';
import actions from './actions';
import { UserLogin } from '../../lib/api-login';



const { loginBegin, loginSuccess, loginErr, logoutBegin, logoutSuccess, logoutErr } = actions;



const userLoginAction = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());
      const response = await UserLogin(userData);
      
      if (response.status === 200) {
        Cookies.set('logedIn', true);
        Cookies.set('userData', JSON.stringify(response.data));
      
        return dispatch(loginSuccess({ login: true, ...response.data }));
      } else {
        return dispatch(loginErr('Login unsuccessful. Status:', response.data.Status));
      }
    } catch (err) {
      console.log(err)
      return dispatch(loginErr(err.message));
    }
  };
};



const userLogout = () => {
  return async (dispatch) => {
    try {
      dispatch(logoutBegin());
      Cookies.remove('logedIn');
      Cookies.remove('userData');
      return dispatch(logoutSuccess({ login: false }));
    } catch (err) {
      return dispatch(logoutErr(err.message));
    }
  };
};

export {  userLoginAction, userLogout };

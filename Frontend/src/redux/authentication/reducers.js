import Cookies from 'js-cookie';
import actions from './actions';

const { LOGIN_BEGIN, LOGIN_SUCCESS, LOGIN_ERR, LOGOUT_BEGIN, LOGOUT_SUCCESS, LOGOUT_ERR } = actions;
const userData = Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : {};

const initState = {
  login: Cookies.get('logedIn'),
  loading: false,
  error: null,
  ...userData
};

/**
 *
 * @todo impure state mutation/explaination
 */
const AuthReducer = (state = initState, action) => {
  const { type, data, err } = action;
  switch (type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
        token: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...data,
        login: data.login,
        loading: false
      };
    case LOGIN_ERR:
      return {
        ...state,
        error: 'Invalid Login Credentials',
        loading: false,
        token: null
      };
    case LOGOUT_BEGIN:
      return {
        ...state,
        loading: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        login: data.login,
        loading: false,
        token: null
      };
    case LOGOUT_ERR:
      return {
        ...state,
        error: err,
        loading: false
      };
    default:
      return state;
  }
};
export default AuthReducer;

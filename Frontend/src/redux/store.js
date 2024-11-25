import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { withExtraArgument } from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducers';

const store = createStore(rootReducer, applyMiddleware(withExtraArgument()));

export default store;

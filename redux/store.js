import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
// import reducer from './reducers'
import logger from 'redux-logger';
import UserReducer from './reducers/UserReducer';

const myLogger = (store) => (next) => (action) => {
    console.log("Action Fired: " + JSON.stringify(action, null, 4));
    next(action);
}

const middleware = applyMiddleware(thunk, logger);


export default createStore(UserReducer, middleware);
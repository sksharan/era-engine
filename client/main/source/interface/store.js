import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import client from './client'

const reducer = combineReducers({
    apollo: client.reducer()
});

const middleware = applyMiddleware(client.middleware(), logger);

const store = createStore(reducer, middleware);

export default store;

import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import * as lights from './lights/index'

const reducer = combineReducers({
    lights: lights.reducer
});

const middleware = applyMiddleware(logger);

const store = createStore(reducer, middleware);

export default store;

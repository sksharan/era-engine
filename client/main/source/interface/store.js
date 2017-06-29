import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import {List} from 'immutable'

// TODO: is this still needed?

const reducer = combineReducers({
    reducer(state=List()) {
        return state;
    }
});

const middleware = applyMiddleware(logger);

const store = createStore(reducer, middleware);

export default store;

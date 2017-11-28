import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'

// FIXME: get this reducer through an index file instead
import {NodeReducer} from './nodes/reducer/node-reducer'

const reducer = combineReducers({
    nodePanel: NodeReducer
});

// To avoid dispatching undefined action, make logger last:
// https://stackoverflow.com/questions/39271923/redux-thunk-dispatch-method-fires-undefined-action
const middleware = applyMiddleware(thunk, logger);

const store = createStore(reducer, middleware);

export default store;

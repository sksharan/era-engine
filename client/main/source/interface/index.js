import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'
import {SelectionReducer} from './common/index'
import {ContentReducer} from './content/index'

// FIXME: get this reducer through an index file instead
import {NodeReducer} from './nodes/reducer/node-reducer'

const reducer = combineReducers({
    contentPanel: ContentReducer,
    nodePanel: NodeReducer,
    'common.selection': SelectionReducer
});

// To avoid dispatching undefined action, make logger last:
// https://stackoverflow.com/questions/39271923/redux-thunk-dispatch-method-fires-undefined-action
const middleware = applyMiddleware(thunk, logger);

export const Store = createStore(reducer, middleware);

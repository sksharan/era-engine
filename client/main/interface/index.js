import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'
import {SelectionReducer, NodeReducer} from './common/index'
import {FileMetadataReducer, ObjectReducer} from './content/index'

const reducer = combineReducers({
    contentPanel: combineReducers({
        files: FileMetadataReducer,
        objects: ObjectReducer,
    }),
    'common.nodes': NodeReducer,
    'common.selection': SelectionReducer
});

// To avoid dispatching undefined action, make logger last:
// https://stackoverflow.com/questions/39271923/redux-thunk-dispatch-method-fires-undefined-action
const middleware = applyMiddleware(thunk, logger);

export const Store = createStore(reducer, middleware);

export {ContentPanel} from './content/index'
export {PropertiesPanel} from './properties/index'
export {NodePanel} from './nodes/index'
export {ToolPanel} from './tools/index'

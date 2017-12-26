import {applyMiddleware, combineReducers, createStore} from 'redux'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'
import {SelectionReducer} from './common/index'

// FIXME: get these reducers through index files instead
import {NodeReducer} from './common/reducer/node-reducer'
import {FileMetadataReducer} from './content/files/reducer/file-metadata-reducer'
import {ObjectReducer} from './content/objects/reducer/object-reducer'

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

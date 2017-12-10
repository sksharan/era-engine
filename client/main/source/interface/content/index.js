import {combineReducers} from 'redux'
import {FileMetadataReducer} from './files/index'
import {ObjectReducer} from './objects/index'

export {ContentPanel} from './base/index'

export const ContentReducer = combineReducers({
    files: FileMetadataReducer,
    objects: ObjectReducer,
});


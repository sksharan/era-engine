import {combineReducers} from 'redux'
import {FileMetadataReducer} from './files/index'

export {ContentPanel} from './base/index'

export const ContentReducer = combineReducers({
    files: FileMetadataReducer
});


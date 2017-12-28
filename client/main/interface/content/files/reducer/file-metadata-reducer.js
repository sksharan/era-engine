import {
    FETCH_FILE_METADATA_REQUEST,
    FETCH_FILE_METADATA_SUCCESS,
    FETCH_FILE_METADATA_FAILURE,
} from '../action/index'

const initialState = {
    isFetching: true,
    isError: false,
    fileMetadataArray: null
}

export const FileMetadataReducer = (state=initialState, action) => {
    switch (action.type) {
        case FETCH_FILE_METADATA_REQUEST:
            return {
                isFetching: true,
                isError: false,
                fileMetadataArray: null
            };
        case FETCH_FILE_METADATA_SUCCESS:
            return {
                isFetching: false,
                isError: false,
                fileMetadataArray: action.payload
            };
        case FETCH_FILE_METADATA_FAILURE:
            return {
                isFetching: false,
                isError: true,
                fileMetadataArray: null
            };
    }
    return state;
}

import {fileMetadataEndpoint} from '../../../../config'

export const FETCH_FILE_METADATA_REQUEST = 'FETCH_FILE_METADATA_REQUEST';
export const FETCH_FILE_METADATA_SUCCESS = 'FETCH_FILE_METADATA_SUCCESS';
export const FETCH_FILE_METADATA_FAILURE = 'FETCH_FILE_METADATA_FAILURE';

export const fetchMetadataForAllFiles = () => {
    return dispatch => {
        dispatch({type: FETCH_FILE_METADATA_REQUEST});
        fetch(fileMetadataEndpoint)
            .then(response => {
                return Promise.all([response.ok, response.json()]);
            })
            .then(([ok, json]) => {
                dispatch({type: ok ? FETCH_FILE_METADATA_SUCCESS : FETCH_FILE_METADATA_FAILURE, payload: json})
            })
            .catch(error => {
                dispatch({type: FETCH_FILE_METADATA_FAILURE, payload: error})
            });
    }
}

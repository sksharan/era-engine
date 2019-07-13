import {sceneNodesEndpoint} from '../../../../config';

export const FETCH_OBJECT_REQUEST = 'FETCH_OBJECT_REQUEST';
export const FETCH_OBJECT_SUCCESS = 'FETCH_OBJECT_SUCCESS';
export const FETCH_OBJECT_FAILURE = 'FETCH_OBJECT_FAILURE';

const pathRegex = '^__object[^\\/]*$';

export const fetchObjects = () => {
    return dispatch => {
        dispatch({type: FETCH_OBJECT_REQUEST});
        fetch(`${sceneNodesEndpoint}?pathRegex=${encodeURIComponent(pathRegex)}`)
            .then(response => {
                return Promise.all([response.ok, response.json()]);
            })
            .then(([ok, json]) => {
                dispatch({type: ok ? FETCH_OBJECT_SUCCESS : FETCH_OBJECT_FAILURE, payload: json});
            })
            .catch(error => {
                dispatch({type: FETCH_OBJECT_FAILURE, payload: error});
            });
    };
};

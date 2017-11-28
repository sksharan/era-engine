import {sceneNodesEndpoint} from '../../../config'

export const FETCH_NODES_REQUEST = 'FETCH_NODES_REQUEST';
export const FETCH_NODES_SUCCESS = 'FETCH_NODES_SUCCESS';
export const FETCH_NODES_FAILURE = 'FETCH_NODES_FAILURE';

export const fetchSceneNodes = () => {
    return dispatch => {
        dispatch({type: FETCH_NODES_REQUEST});
        fetch(sceneNodesEndpoint)
            .then(response => {
                return Promise.all([response.ok, response.json()]);
            })
            .then(([ok, json]) => {
                dispatch({type: ok ? FETCH_NODES_SUCCESS : FETCH_NODES_FAILURE, payload: json})
            })
            .catch(error => {
                dispatch({type: FETCH_NODES_FAILURE, payload: error})
            });
    }
}

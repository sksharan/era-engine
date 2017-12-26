// FIXME: import from the index file instead
import {
    FETCH_NODES_REQUEST,
    FETCH_NODES_SUCCESS,
    FETCH_NODES_FAILURE
} from '../action/node-action-type'

const initialState = {
    isFetching: true,
    isError: false,
    nodeArray: null
}

export const NodeReducer = (state=initialState, action) => {
    switch (action.type) {
        case FETCH_NODES_REQUEST:
            return {
                isFetching: true,
                isError: false,
                nodeArray: null
            };
        case FETCH_NODES_SUCCESS:
            return {
                isFetching: false,
                isError: false,
                nodeArray: action.payload
            };
        case FETCH_NODES_FAILURE:
            return {
                isFetching: false,
                isError: true,
                nodeArray: null
            };
    }
    return state;
}

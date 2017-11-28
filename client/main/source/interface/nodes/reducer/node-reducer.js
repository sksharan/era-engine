import {
    FETCH_NODES_REQUEST,
    FETCH_NODES_SUCCESS,
    FETCH_NODES_FAILURE
} from '../action/index'

const initialState = {
    isFetching: true,
    isError: false,
    nodes: null
}

export const NodeReducer = (state=initialState, action) => {
    switch (action.type) {
        case FETCH_NODES_REQUEST:
            return {
                isFetching: true,
                isError: false,
                nodes: null
            };
        case FETCH_NODES_SUCCESS:
            return {
                isFetching: false,
                isError: false,
                nodes: action.payload
            };
        case FETCH_NODES_FAILURE:
            return {
                isFetching: false,
                isError: true,
                nodes: null
            };
    }
    return state;
}

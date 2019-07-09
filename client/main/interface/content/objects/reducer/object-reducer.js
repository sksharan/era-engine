import {FETCH_OBJECT_REQUEST, FETCH_OBJECT_SUCCESS, FETCH_OBJECT_FAILURE} from '../action/index';

const initialState = {
    isFetching: true,
    isError: false,
    objectArray: null
};

export const ObjectReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_OBJECT_REQUEST:
            return {
                isFetching: true,
                isError: false,
                objectArray: null
            };
        case FETCH_OBJECT_SUCCESS:
            return {
                isFetching: false,
                isError: false,
                objectArray: action.payload
            };
        case FETCH_OBJECT_FAILURE:
            return {
                isFetching: false,
                isError: true,
                objectArray: null
            };
    }
    return state;
};

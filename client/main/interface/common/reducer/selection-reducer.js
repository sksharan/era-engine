import {SELECT_NODE, DESELECT_NODE} from '../action/index';

const initialState = {
    selectedNode: null
};

export const SelectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_NODE:
            return {
                selectedNode: action.payload
            };
        case DESELECT_NODE:
            return {
                selectedNode: null
            };
        default:
            return state;
    }
};

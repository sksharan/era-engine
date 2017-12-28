import {
    SELECT_NODE,
} from '../action/index'

const initialState = {
    selectedNode: null
};

export const SelectionReducer = (state=initialState, action) => {
    switch (action.type) {
        case SELECT_NODE:
            return {
                selectedNode: action.payload
            };
        default:
            return state;
    }
}

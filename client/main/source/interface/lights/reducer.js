import {List} from 'immutable'

export default function reducer(state=List(), action) {
    switch (action.type) {
        case 'CREATE_LIGHT':
            return state.push(action.payload);
        default:
            break;
    }
    return state;
}

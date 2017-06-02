import Light from './light'
import {List} from 'immutable'

export default function reducer(state=List(), action) {
    switch (action.type) {
        case 'CREATE_LIGHT':
            return state.push(new Light(
                action.payload.lightId,
                action.payload.name,
                action.payload.type,
                action.payload.worldPosition,
                action.payload.ambient,
                action.payload.diffuse,
                action.payload.specular));
        default:
            break;
    }
    return state;
}

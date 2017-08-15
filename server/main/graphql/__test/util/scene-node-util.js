import {LightSelectFields} from './light-util'
import {ObjectSelectFields} from './object-util'

export const SceneNodeSelectFields = `
    id
    path
    name
    type
    localMatrix
    content {
        ... on Light {
            ${LightSelectFields}
        }
        ... on Object {
            ${ObjectSelectFields}
        }
    }
`;

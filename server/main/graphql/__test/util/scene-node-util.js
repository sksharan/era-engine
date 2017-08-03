import {LightSelectFields} from './light-util'

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
    }
`;

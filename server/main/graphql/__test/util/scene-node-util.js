import {LightSelectFields} from './light-util'
import {ObjectSelectFields} from './object-util'
import {ObjectRefSelectFields} from './object-ref-util'

export const getSceneNode = ({id, name, path}) => {
    return `{
        ${id ? `id: "${id}",` : ""}
        name: "${name}",
        type: DEFAULT,
        localMatrix: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        path: "${path}"
    }`;
}

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
        ... on ObjectRef {
            ${ObjectRefSelectFields}
        }
    }
`;

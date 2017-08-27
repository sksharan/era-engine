import {gql} from 'react-apollo'

export const LightSelectFields = `
    name
    type
    ambient { r g b a }
    diffuse { r g b a }
    specular { r g b a }
    specularTerm
    quadraticAttenuation
    linearAttenuation
    constantAttenuation
`;

export const ObjectSelectFields = `
    positions
    normals
    texcoords
    indices
    ambient { r g b a }
    diffuse { r g b a }
    specular { r g b a }
    shininess
    textureFileId
`;

export const ObjectRefSelectFields = `
    objectSceneNodeId
`;

export const SelectAllQuery = gql`
    {
        sceneNodes(pathRegex: ".*") {
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
        }
    }
`

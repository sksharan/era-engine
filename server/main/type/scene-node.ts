interface Color {
    r: number,
    g: number,
    b: number,
    a: number
}

interface SceneNodeBase {
    id?: string,
    path: string,
    name: string,
    localMatrix: [
        number, number, number, number,
        number, number, number, number,
        number, number, number, number,
        number, number, number, number
    ]
}

interface DefaultSceneNode extends SceneNodeBase {
    type: 'DEFAULT',
    content: null
}

interface LightSceneNode extends SceneNodeBase {
    type: 'LIGHT',
    content: {
        type: string,
        ambient: Color,
        diffuse: Color,
        specular: Color,
        specularTerm: number,
        quadraticAttenuation: number,
        linearAttenuation: number,
        constantAttenuation: number
    }
}

interface ObjectSceneNode extends SceneNodeBase {
    type: 'OBJECT',
    content: {
        positions: number[],
        normals: number[],
        texcoords: number[],
        indices: number[],
        ambient: Color,
        diffuse: Color,
        specular: Color,
        shininess: number,
        textureFileId: string
    }
}

interface ReferenceSceneNode extends SceneNodeBase {
    type: 'REFERENCE',
    content: {
        sceneNodeId: string
    }
}

export type SceneNode = DefaultSceneNode | LightSceneNode | ObjectSceneNode | ReferenceSceneNode;

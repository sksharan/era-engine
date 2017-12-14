import {mat4} from 'gl-matrix'
import {filesEndpoint} from '../../config'
import {
    BoundingBox,
    GeometryNode,
    Material,
    Mesh,
    ProgramBuilder,
    SceneNode,
    ReferenceNode,
} from '../../engine/index'

export {
    SceneNodeType,
    ReferenceNodeEngineCache,
    ReferenceNodeExternalCache,
} from '../../engine/index'

export const generateRenderNode = () => {
    return new SceneNode();
}

export const addChildToRenderNode = (childRenderNode, parentRenderNode) => {
    parentRenderNode.addChild(childRenderNode);
}

const objectProgramData = new ProgramBuilder()
        .addPosition()
        .addNormal()
        .addTexcoord()
        .addColor()
        .build();

export const addObjectWithBoundingBox = (sceneNode, parentRenderNode) => {
    const mesh = new Mesh({
        positions: sceneNode.content.positions,
        normals: sceneNode.content.normals,
        texcoords: sceneNode.content.texcoords,
        numVertices: sceneNode.content.positions.length,
        indices: sceneNode.content.indices
    });
    const renderNode = new GeometryNode(sceneNode.content.positions.localMatrix, {
        mesh,
        material: new Material({
            programData: objectProgramData,
            imageSrc: `${filesEndpoint}/${sceneNode.content.textureFileId}/content`
        })
    });
    parentRenderNode.addChild(renderNode);

    const localMatrix = mat4.create();
    const obb = new GeometryNode(localMatrix, {
        mesh: new BoundingBox(sceneNode.content.positions),
        material: new Material({
            programData: objectProgramData,
            imageSrc: `${filesEndpoint}/${sceneNode.content.textureFileId}/content`,
            isVisible: false
        })
    });
    renderNode.addChild(obb);
}

export const convertToRenderRefNode = (sceneNode) => {
    if (sceneNode.type !== 'REFERENCE') {
        throw new TypeError(`Expected scene node to have type REFERENCE, but has type ${sceneNode.type} instead`);
    }
    return new ReferenceNode(sceneNode.localMatrix, sceneNode.sceneNodeId);
}

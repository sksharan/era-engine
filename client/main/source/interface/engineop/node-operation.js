import {mat4} from 'gl-matrix'
import {
    BoundingBox,
    GeometryNode,
    Material,
    Mesh,
    ProgramBuilder,
    SceneNode,
} from '../../engine/index'
import {filesEndpoint} from '../../config'

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
            isVisible: true
        })
    });
    renderNode.addChild(obb);
}

import {mat4} from 'gl-matrix';
import {filesEndpoint} from '../../config';
import {BoundingBox, RenderNode, GeometryNode, Material, Mesh, ProgramBuilder, ReferenceNode} from '../../engine/index';

export const convertSceneNodesToRenderNodes = sceneNodes => {
    let renderNodes = [];
    for (let sceneNode of sceneNodes) {
        renderNodes.push(convertSceneNodeToRenderNode(sceneNode));
    }
    return renderNodes;
};

export const convertSceneNodeToRenderNode = sceneNode => {
    switch (sceneNode.type) {
        case 'DEFAULT':
            return new RenderNode({id: sceneNode._id});
        case 'OBJECT':
            return convertObjectSceneNodeToGeometryRenderNode(sceneNode);
        case 'REFERENCE':
            return convertReferenceSceneNodeToReferenceRenderNode(sceneNode);
        default:
            throw new TypeError(`Unknown scene node type: ${sceneNode.type}`);
    }
};

const convertObjectSceneNodeToGeometryRenderNode = sceneNode => {
    const objectProgramData = new ProgramBuilder()
        .addPosition()
        .addNormal()
        .addTexcoord()
        .addColor()
        .build();

    const mesh = new Mesh({
        positions: sceneNode.content.positions,
        normals: sceneNode.content.normals,
        texcoords: sceneNode.content.texcoords,
        numVertices: sceneNode.content.positions.length,
        indices: sceneNode.content.indices
    });
    const renderNode = new GeometryNode({
        id: sceneNode._id,
        localMatrix: sceneNode.content.positions.localMatrix,
        mesh,
        material: new Material({
            programData: objectProgramData,
            imageSrc: `${filesEndpoint}/${sceneNode.content.textureFileId}/content`
        })
    });

    const localMatrix = mat4.create();
    const obb = new GeometryNode({
        localMatrix,
        mesh: new BoundingBox(sceneNode.content.positions),
        material: new Material({
            programData: objectProgramData,
            imageSrc: `${filesEndpoint}/${sceneNode.content.textureFileId}/content`,
            isVisible: false
        })
    });
    renderNode.addChild(obb);

    return renderNode;
};

const convertReferenceSceneNodeToReferenceRenderNode = sceneNode => {
    return new ReferenceNode({
        id: sceneNode._id,
        localMatrix: sceneNode.localMatrix,
        referencedNodeId: sceneNode._id
    });
};

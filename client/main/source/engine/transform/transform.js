import {SceneNode, GeometryNode} from '../node/index'
import {Material} from '../material/index'
import {Mesh, BoundingBox} from '../mesh/index'
import {ProgramBuilder} from '../shader/index'
import {colorTexture} from './color'
import {mat4} from 'gl-matrix'

export class TransformMesh extends Mesh {
    constructor(meshArgs) {
        super(meshArgs);
        this.min = Number.NEGATIVE_INFINITY;
        this.max = Number.POSITIVE_INFINITY;

    }
    generateBoundingBoxNode() {
        throw new Error('No base implementation');
    }
    _generateBoundingBoxNode(positions) {
        return new GeometryNode(mat4.create(), {
            mesh: new BoundingBox(positions),
            material: new Material({
                programData: new ProgramBuilder()
                        .addPosition().addTexcoord().build(),
                imageSrc: colorTexture,
                isVisible: false
            })
        });
    }
    handleTransform(baseSceneNode, delta) {
        this._validateTransformArgs(baseSceneNode, delta);
    }
    _validateTransformArgs(baseSceneNode) {
        if (!(baseSceneNode instanceof SceneNode)) {
            throw new Error('baseSceneNode must be a SceneNode');
        }
        if (baseSceneNode.nodeType !== 'BASE') {
            throw new Error('Scene node must have a type of BASE');
        }
    }
}

export const attachToBaseNode = ({base, mesh, zClip}) => {
    const objectNode = new GeometryNode(mat4.create(), {
        mesh,
        material: getTransformMaterial(zClip)
    });
    const boundingBoxNode = new GeometryNode(mat4.create(), {
        mesh: new BoundingBox(objectNode.mesh.positions),
        material: getBoundingBoxMaterial()
    });
    base.addChild(objectNode);
    objectNode.addChild(boundingBoxNode);
}
function getTransformMaterial(zClip) {
    return new Material({
        programData: new ProgramBuilder().addPosition().addFixedZClip(zClip).addTexcoord().build(),
        imageSrc: colorTexture
    });
}
function getBoundingBoxMaterial() {
    return new Material({
        programData: new ProgramBuilder().addPosition().addTexcoord().build(),
        imageSrc: colorTexture,
        isVisible: false
    });
}

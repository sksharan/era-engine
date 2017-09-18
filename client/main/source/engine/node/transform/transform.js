import SceneNode from '../scene-node'
import GeometryNode from  '../geometry-node'
import {Material} from '../../material/index'
import {Mesh, BoundingBox} from '../../mesh/index'
import {ProgramBuilder} from '../../shader/index'
import {rgbTexture} from './rgb'
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
                imageSrc: rgbTexture,
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

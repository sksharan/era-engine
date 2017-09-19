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

export class TransformMaterial extends Material {
    constructor() {
        super({
            programData: new ProgramBuilder()
                    .addPosition().addZClipZero().addTexcoord().build(),
            imageSrc: rgbTexture
        });
    }
}
export class TransformBoundingBoxMaterial extends Material {
    constructor() {
        super({
            programData: new ProgramBuilder()
                    .addPosition().addTexcoord().build(),
            imageSrc: rgbTexture,
            isVisible: false
        })
    }
}
export const createTransformNode = (transformXMesh, transformYMesh, transformZMesh) => {
    const localMatrix = mat4.create();
    const base = new SceneNode(localMatrix);

    const transformX = new GeometryNode(mat4.create(), {
        mesh: transformXMesh,
        material: new TransformMaterial()
    });
    const transformXBoundingBox = new GeometryNode(mat4.create(), {
        mesh: new BoundingBox(transformX.mesh.positions),
        material: new TransformBoundingBoxMaterial()
    });
    base.addChild(transformX);
    transformX.addChild(transformXBoundingBox);

    const transformY = new GeometryNode(mat4.create(), {
        mesh: transformYMesh,
        material: new TransformMaterial()
    });
    const transformYBoundingBox = new GeometryNode(mat4.create(), {
        mesh: new BoundingBox(transformY.mesh.positions),
        material: new TransformBoundingBoxMaterial()
    });
    base.addChild(transformY);
    transformY.addChild(transformYBoundingBox);

    const transformZ = new GeometryNode(mat4.create(), {
        mesh: transformZMesh,
        material: new TransformMaterial()
    });
    const transformZBoundingBox = new GeometryNode(mat4.create(), {
        mesh: new BoundingBox(transformZ.mesh.positions),
        material: new TransformBoundingBoxMaterial()
    });
    base.addChild(transformZ);
    transformZ.addChild(transformZBoundingBox);

    return base;
}

import GeometryNode from  '../geometry-node'
import {Material} from '../../material/index'
import {Mesh, BoundingBox} from '../../mesh/index'
import {ProgramBuilder} from '../../shader/index'
import {rgbTexture} from './rgb'
import {mat4} from 'gl-matrix'

const min = Number.NEGATIVE_INFINITY;
const max = Number.POSITIVE_INFINITY;

export default class TransformMesh extends Mesh {
    generateXBoundingPlaneNode() {
        return generateBoundingPlaneNode([min, 0, min, max, 0, max]);
    }
    generateYBoundingPlaneNode() {
        return generateBoundingPlaneNode([min, min, 0, max, max, 0]);
    }
    generateZBoundingPlaneNode() {
        return generateBoundingPlaneNode([min, 0, min, max, 0, max]);
    }
}

function generateBoundingPlaneNode(positions) {
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

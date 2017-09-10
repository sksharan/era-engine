import GeometryNode from  '../geometry-node'
import {Material} from '../../material/index'
import {Mesh, BoundingBox} from '../../mesh/index'
import {ProgramBuilder} from '../../shader/index'
import {rgbTexture} from './rgb'

const min = Number.NEGATIVE_INFINITY;
const max = Number.POSITIVE_INFINITY;

export default class TransformMesh extends Mesh {
    generateXBoundingPlaneNode(localMatrix) {
        return generateBoundingPlaneNode(localMatrix, [min, 0, min, max, 0, max]);
    }
    generateYBoundingPlaneNode(localMatrix) {
        return generateBoundingPlaneNode(localMatrix, [min, min, 0, max, max, 0]);
    }
    generateZBoundingPlaneNode(localMatrix) {
        return generateBoundingPlaneNode(localMatrix, [min, 0, min, max, 0, max]);
    }
}

function generateBoundingPlaneNode(localMatrix, positions) {
    return new GeometryNode(localMatrix, {
        mesh: new BoundingBox(positions),
        material: new Material({
            programData: new ProgramBuilder()
                    .addPosition().addTexcoord().build(),
            imageSrc: rgbTexture,
            isVisible: true
        })
    });
}

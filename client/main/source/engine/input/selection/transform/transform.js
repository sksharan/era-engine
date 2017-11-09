import {SceneNode, GeometryNode} from '../../../node/index'
import {Material} from '../../../material/index'
import {Mesh, BoundingBox} from '../../../mesh/index'
import {ProgramBuilder} from '../../../shader/index'
import {gl} from '../../../gl'
import {TransformScaleFactor} from './transform-scale-factor'
import {mat4, vec4} from 'gl-matrix'

export class TransformMesh extends Mesh {
    constructor(meshArgs) {
        super(meshArgs);
        this._positions = meshArgs.positions;
        this._min = -5000;
        this._max = 5000;
    }
    get positions() {
        return this._positions;
    }
    generateBoundingPlaneNode() {
        throw new Error('No base implementation');
    }
    _generateBoundingBoxNode(positions) {
        return new GeometryNode(mat4.create(), {
            mesh: new BoundingBox(positions),
            material: new Material({
                programData: new ProgramBuilder().addPosition().addColor().build(),
                color: vec4.fromValues(0.0, 0.0, 0.0, 1.0),
                isVisible: false
            })
        });
    }
    generateAxisLineGeometryNode() {
        throw new Error('No base implementation');
    }
    _generateAxisLineGeometryNode(positions, color) {
        if (positions.length !== 6) { // 2 vertices * 3 floats per vertex
            throw new Error(`Positions must have length 6, but has length ${positions.length}`);
        }
        return new GeometryNode(mat4.create(), {
            mesh: new Mesh({
                drawMode: gl.LINES,
                positions,
                normals: [0, 0, 0, 0, 0, 0],
                texcoords: [0, 0, 0, 0],
                numVertices: positions.length
            }),
            material: new Material({
                programData: new ProgramBuilder()
                        .addPosition().addColor().build(),
                color
            })
        });
    }
    handleTransform({baseSceneNode, intersectionDelta, intersectionPoint}) {
        this._validateTransformArgs({baseSceneNode, intersectionDelta, intersectionPoint});
    }
    _validateTransformArgs({baseSceneNode, intersectionDelta, intersectionPoint}) {
        if (!(baseSceneNode instanceof SceneNode)) {
            throw new Error('baseSceneNode must be a SceneNode');
        }
        if (baseSceneNode.nodeType !== 'BASE') {
            throw new Error('Scene node must have a type of BASE');
        }
        if (!(intersectionDelta instanceof Float32Array)) {
            throw new TypeError('Intersection delta must be a vec3 (Float32Array)');
        }
        if (intersectionPoint && !(intersectionPoint instanceof Float32Array)) {
            throw new TypeError('Intersection point must be a vec3 (Float32Array)');
        }
    }
}

export const attachToBaseNode = ({base, mesh, color, generateBoundingBox=true, useSphereClipping=false,
        sphereRadius=0, useSphereOutling=false}) => {
    const objectNode = new GeometryNode(mat4.create(), {
        mesh,
        material: getTransformMaterial({color, useSphereClipping, sphereRadius, useSphereOutling})
    });
    base.addChild(objectNode);

    if (generateBoundingBox) {
        const boundingBoxNode = new GeometryNode(mat4.create(), {
            mesh: new BoundingBox(objectNode.mesh.positions),
            material: getBoundingBoxMaterial({color})
        });
        objectNode.addChild(boundingBoxNode);
    }
}
function getTransformMaterial({color, useSphereClipping, sphereRadius, useSphereOutling}) {
    let programData = new ProgramBuilder();
    programData = programData.addPosition({scaleFactor: TransformScaleFactor});
    if (useSphereClipping) {
        programData = programData.addSphereClipping({sphereRadius});
    }
    if (useSphereOutling) {
        programData = programData.addNormal().addSphereOutlining({epsilon: 0.10});
    }
    programData = programData.addColor().build();
    return new Material({
        programData,
        color,
        ignoreDepth: true
    });
}
function getBoundingBoxMaterial({color}) {
    return new Material({
        programData: new ProgramBuilder().addPosition().addColor().build(),
        color,
        isVisible: false
    });
}

import {SelectionState} from './selection-state'
import {SelectedState} from './selected-state'
import {findNearestBaseNodeForBoundingBoxNode} from './node-finder'
import {
    TranslateXMesh,
    TranslateYMesh,
    TranslateZMesh,
} from '../../node/index'
import {mat4, vec3} from 'gl-matrix'

export class TransformingState extends SelectionState {
    constructor(selectedObjectBaseNode, transformBoundingBoxNode) {
        super();
        // Object being transformed
        this._selectedObjectBaseNode = selectedObjectBaseNode;
        // The x, y, or z component of the gizmo, a geometry node and its bounding box
        this._transformBoundingBoxNode = transformBoundingBoxNode;
        this._transformGeometryNode = transformBoundingBoxNode.parent;

        this._transformBoundingPlaneNode = null;
        this._lastIntersectionPoint = null;
    }
    onEnter() {
        // Generate plane around the gizmo component so the user can manipulate
        // the object without having to keep the mouse directly on the gizmo
        this._transformBoundingPlaneNode = this._getBoundingPlaneNode();
        this._transformBoundingBoxNode.addChild(this._transformBoundingPlaneNode);
    }
    handleMouseDown() {
        return null;
    }
    handleMouseUp() {
        return this._transitionToSelectedState();
    }
    handleMouseMove(mouseX, mouseY) {
        // Only consider if there's an intersection with the plane
        const intersection = this._getNearestIntersection(mouseX, mouseY, this._transformBoundingPlaneNode);
        if (intersection.boundingBoxNode) {
            if (this._lastIntersectionPoint) {
                this._handleTransformation(intersection);
            }
            this._lastIntersectionPoint = intersection.point;
            return null;
        }
        // Otherwise we're no longer actively transforming the object
        return this._transitionToSelectedState();
    }
    onExit() {
        // Detach the plane from the gizmo component
        this._transformBoundingPlaneNode.removeParent();
    }

    _getBoundingPlaneNode() {
        const mesh = this._transformGeometryNode.mesh;
        if (mesh instanceof TranslateXMesh) {
            return mesh.generateXBoundingPlaneNode();
        } else if (mesh instanceof TranslateYMesh) {
            return mesh.generateYBoundingPlaneNode();
        } else if (mesh instanceof TranslateZMesh) {
            return mesh.generateZBoundingPlaneNode();
        }
        throw new TypeError('Unexpected mesh type');
    }

    _handleTransformation(intersection) {
        const mesh = this._transformGeometryNode.mesh;
        const delta = vec3.sub(vec3.create(), intersection.point, this._lastIntersectionPoint);

        if (mesh instanceof TranslateXMesh) {
            this._selectedObjectBaseNode.localMatrix = mat4.translate(mat4.create(),
                    this._selectedObjectBaseNode.localMatrix,
                    vec3.fromValues(delta[0], 0, 0));
        } else if (mesh instanceof TranslateYMesh) {
            this._selectedObjectBaseNode.localMatrix = mat4.translate(mat4.create(),
                    this._selectedObjectBaseNode.localMatrix,
                    vec3.fromValues(0, delta[1], 0));
        } else if (mesh instanceof TranslateZMesh) {
            this._selectedObjectBaseNode.localMatrix = mat4.translate(mat4.create(),
                    this._selectedObjectBaseNode.localMatrix,
                    vec3.fromValues(0, 0, delta[2]));
        }
    }

    _transitionToSelectedState() {
        const transformBaseNode = findNearestBaseNodeForBoundingBoxNode(this._transformGeometryNode);
        return new SelectedState(this._selectedObjectBaseNode, transformBaseNode);
    }
}

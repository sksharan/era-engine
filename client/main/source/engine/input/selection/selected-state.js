import {SelectionState} from './selection-state'
import {NoneSelectedState} from './none-selected-state'
import {TransformingState} from './transforming-state'
import {colorGeometryNodes} from './node-colorizer'
import {findNearestBaseNodeForBoundingBoxNode} from './node-finder'
import {vec4} from 'gl-matrix'

export class SelectedState extends SelectionState {
    constructor(selectedObjectBaseNode, transformBaseNode) {
        super();
        this._selectedObjectBaseNode = selectedObjectBaseNode;
        this._transformBaseNode = transformBaseNode;
    }
    onEnter() {
        // Do nothing
    }
    handleMouseDown(mouseX, mouseY, sceneNode) {
        let intersection = null;
        // Clicked on the transformation gizmo?
        intersection = this._getNearestIntersection(mouseX, mouseY, this._transformBaseNode);
        if (intersection.boundingBoxNode) {
            // Clicked on the x, y, or z axis of the gizmo
            const transformBoundingBoxNode = intersection.boundingBoxNode;
            return new TransformingState(this._selectedObjectBaseNode, transformBoundingBoxNode);
        }
        // Clicked on an object instead?
        intersection = this._getNearestIntersection(mouseX, mouseY, sceneNode);
        if (intersection.boundingBoxNode) {
            const selectedObjectBaseNode = findNearestBaseNodeForBoundingBoxNode(intersection.boundingBoxNode);
            if (selectedObjectBaseNode !== this._selectedObjectBaseNode) {
                // Selected a new object
                return this._transitionToSelectedState(selectedObjectBaseNode)
            }
            return null;
        }
        // No intersection, so object has been deselected
        return this._transitionToNoneSelectedState();
    }
    handleMouseUp() {
        return null;
    }
    handleMouseMove() {
        return null;
    }
    onExit() {
        // Do nothing
    }

    _transitionToNoneSelectedState() {
        // Remove highlighting from selected object
        colorGeometryNodes(this._selectedObjectBaseNode, vec4.fromValues(0, 0, 0, 0));
        // Detach transformation gizmo
        this._transformBaseNode.removeParent();
        // Next state
        return new NoneSelectedState();
    }

    _transitionToSelectedState(selectedObjectBaseNode) {
        // Move the transformation gizmo to the newly selected object
        this._transformBaseNode.removeParent();
        selectedObjectBaseNode.addChild(this._transformBaseNode);
        // Next state
        return new SelectedState(selectedObjectBaseNode, this._transformBaseNode);
    }
}

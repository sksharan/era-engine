import {SelectionState} from './selection-state'
import {SelectedState} from './selected-state'
import {findNearestBaseNodeForBoundingBoxNode} from './node-finder'
import {colorGeometryNodes} from './node-colorizer'
import {vec4} from 'gl-matrix'

export class NoneSelectedState extends SelectionState {
    onEnter() {
        // Do nothing
    }
    handleDocumentClick() {
        return null;
    }
    handleCanvasMouseDown(mouseX, mouseY, sceneNode) {
        const intersection = this._getNearestIntersection(mouseX, mouseY, sceneNode);
        if (intersection.boundingBoxNode) {
            return this._transitionToSelectedState(intersection);
        }
        return null;
    }
    handleCanvasMouseUp() {
        return null;
    }
    handleCanvasMouseMove() {
        return null;
    }
    handleKeyDown() {
        return null;
    }
    handleKeyUp() {
        return null;
    }
    onExit() {
        // Do nothing
    }

    _transitionToSelectedState(intersection) {
        // Selected an object - given the bounding box, get the selected object base node
        const selectedObjectBaseNode = findNearestBaseNodeForBoundingBoxNode(intersection.boundingBoxNode);
        // Highlight the selected object
        colorGeometryNodes(selectedObjectBaseNode, vec4.fromValues(0.15, 0.15, 0.15, 0));
        // Next state
        return new SelectedState(selectedObjectBaseNode);

    }
}

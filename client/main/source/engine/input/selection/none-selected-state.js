import {SelectionState} from './selection-state'
import {SelectedState} from './selected-state'
import {findNearestBaseNodeForBoundingBoxNode} from './node-finder'
import {colorGeometryNodes} from './node-colorizer'
import {createTranslateNode} from '../../node/index'
import {vec4} from 'gl-matrix'

export class NoneSelectedState extends SelectionState {
    onEnter() {
        // Do nothing
    }
    handleMouseDown(mouseX, mouseY, sceneNode) {
        const intersection = this._getNearestIntersection(mouseX, mouseY, sceneNode);
        if (intersection.boundingBoxNode) {
            return this._transitionToSelectedState(intersection);
        }
        return null;
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

    _transitionToSelectedState(intersection) {
        // Selected an object - given the bounding box, get the selected object base node
        const selectedObjectBaseNode = findNearestBaseNodeForBoundingBoxNode(intersection.boundingBoxNode);
        // Highlight the selected object
        colorGeometryNodes(selectedObjectBaseNode, vec4.fromValues(0.15, 0.15, 0.15, 0));
        // Attach the transformation gizmo
        const transformBaseNode = createTranslateNode();
        selectedObjectBaseNode.addChild(transformBaseNode);
        // Next state
        return new SelectedState(selectedObjectBaseNode, transformBaseNode);

    }
}

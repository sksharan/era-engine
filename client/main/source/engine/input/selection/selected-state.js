import {SelectionState} from './selection-state'
import {NoneSelectedState} from './none-selected-state'
import {TransformingState} from './transforming-state'
import {colorGeometryNodes} from './node-colorizer'
import {findNearestBaseNodeForBoundingBoxNode} from './node-finder'
import {
    createTranslateNode,
    createScaleNode,
    createRotateNode,
    CurrentTransformMode,
    TRANSLATE, SCALE, ROTATE,
} from './transform/index'
import {mat4, vec3, vec4} from 'gl-matrix'

export class SelectedState extends SelectionState {
    constructor(selectedObjectBaseNode) {
        super();
        this._selectedObjectBaseNode = selectedObjectBaseNode;
        this._transformBaseNode = null;
        this._currTransformMode = null;
    }
    onEnter() {
        this._setupTransformNode();
    }
    handleDocumentClick() {
        this._setupTransformNode();
        return null;
    }
    handleCanvasMouseDown(mouseX, mouseY, sceneNode) {
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
                return new SelectedState(selectedObjectBaseNode);
            }
            return null;
        }
        // No intersection, so object has been deselected - remove highlighting from selected object
        colorGeometryNodes(this._selectedObjectBaseNode, vec4.fromValues(0, 0, 0, 0));
        return new NoneSelectedState();
    }
    handleCanvasMouseUp() {
        return null;
    }
    handleCanvasMouseMove() {
        return null;
    }
    onExit() {
        // Detach the transformation gizmo
        this._transformBaseNode.removeParent();
    }

    _setupTransformNode() {
        if (CurrentTransformMode.getCurrent() === this._currTransformMode) {
            return;
        }
        // Detach previous transform gizmo if one already exists
        if (this._transformBaseNode) {
            this._transformBaseNode.removeParent();
        }
        // Attach the new transformation gizmo
        const mode = CurrentTransformMode.getCurrent()
        if (mode === TRANSLATE) {
            this._transformBaseNode = createTranslateNode();
        } else if (mode === SCALE) {
            this._transformBaseNode = createScaleNode();
        } else if (mode === ROTATE) {
            this._transformBaseNode = createRotateNode();
        } else {
            console.warn(`Unknown mode ${mode}, defaulting to translate`);
            this._transformBaseNode = createTranslateNode();
        }
        this._currTransformMode = mode;
        // Attach gizmo to object
        this._selectedObjectBaseNode.addChild(this._transformBaseNode);
        // The gizmo itself shouldn't be affected by any transformation applied to the object except translation
        this._transformBaseNode.localMatrix = mat4.translate(
            mat4.create(),
            mat4.invert(mat4.create(), this._selectedObjectBaseNode.localMatrix), // Undo all object transformations
            mat4.getTranslation(vec3.create(), this._selectedObjectBaseNode.localMatrix) // Then apply only object translation
        );
    }
}

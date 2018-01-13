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
    TransformScaleFactor,
} from './transform/index'
import {CurrentTransformOrientation} from '../../global/index'
import {Camera} from '../../camera/index'
import {
    triggerNodeSelectedEvent,
    triggerNodeDeselectedEvent
} from '../../../common/index'
import {mat4, vec3, vec4} from 'gl-matrix'

export class SelectedState extends SelectionState {
    constructor(selectedObjectNode) {
        super();
        this._selectedObjectNode = selectedObjectNode;
        this._transformBaseNode = null;
        this._currTransformMode = null;
        this._lastTransformOrientation = null;
    }
    onEnter() {
        // Highlight the selected object
        colorGeometryNodes(this._selectedObjectNode, vec4.fromValues(0.15, 0.15, 0.15, 0));

        this._setupTransformNode();
        this._scaleTransformGizmoBoundingBox();
    }
    handleDocumentClick() {
        this._setupTransformNode();
        this._scaleTransformGizmoBoundingBox();
        return null;
    }
    handleCanvasMouseDown(mouseX, mouseY, renderNode) {
        let intersection = null;
        // Clicked on the transformation gizmo?
        intersection = this._getNearestIntersection(mouseX, mouseY, this._transformBaseNode);
        if (intersection.boundingBoxNode) {
            // Clicked on the x, y, or z axis of the gizmo
            const transformBoundingBoxNode = intersection.boundingBoxNode;
            return new TransformingState(this._selectedObjectNode, transformBoundingBoxNode);
        }
        // Clicked on an object instead?
        intersection = this._getNearestIntersection(mouseX, mouseY, renderNode);
        if (intersection.boundingBoxNode) {
            const selectedObjectNode = findNearestBaseNodeForBoundingBoxNode(intersection.boundingBoxNode);
            if (selectedObjectNode !== this._selectedObjectNode) {
                triggerNodeDeselectedEvent(this._selectedObjectNode);
                triggerNodeSelectedEvent(selectedObjectNode);
                return this._transitionToNewSelectedState(selectedObjectNode);
            }
            return null;
        }
        // No intersection, so object has been deselected - remove highlighting from selected object
        colorGeometryNodes(this._selectedObjectNode, vec4.fromValues(0, 0, 0, 0));
        triggerNodeDeselectedEvent(this._selectedObjectNode);
        return new NoneSelectedState();
    }
    handleCanvasMouseUp() {
        return null;
    }
    handleCanvasMouseMove() {
        return null;
    }
    handleKeyDown() {
        this._scaleTransformGizmoBoundingBox();
        return null;
    }
    handleKeyUp() {
        this._scaleTransformGizmoBoundingBox();
        return null;
    }
    onExit() {
        // Detach the transformation gizmo
        this._transformBaseNode.removeParent();
    }
    onNodeSelectedEvent(selectedObjectNode) {
        return this._transitionToNewSelectedState(selectedObjectNode);
    }

    // Selected a new object
    _transitionToNewSelectedState(selectedObjectNode) {
        colorGeometryNodes(this._selectedObjectNode, vec4.fromValues(0, 0, 0, 0));
        return new SelectedState(selectedObjectNode);
    }

    _setupTransformNode() {
        if (CurrentTransformMode.getCurrent() === this._currTransformMode
            && this._lastTransformOrientation === CurrentTransformOrientation.orientation) {
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
        this._selectedObjectNode.addChild(this._transformBaseNode);

        if (CurrentTransformOrientation.isGlobal()) {
            // The gizmo itself shouldn't be affected by any transformation applied to the object except translation
            this._transformBaseNode.localMatrix = mat4.translate(
                mat4.create(),
                mat4.invert(mat4.create(), this._selectedObjectNode.localMatrix), // Undo all object transformations
                mat4.getTranslation(vec3.create(), this._selectedObjectNode.localMatrix)); // Then apply only object translation
        } else if (CurrentTransformOrientation.isLocal()) {
            // The gizmo should be affected by everything except scaling
            const scale = mat4.getScaling(vec3.create(), this._selectedObjectNode.localMatrix);
            const invertedScale = mat4.invert(mat4.create(), mat4.fromScaling(mat4.create(), scale));
            this._transformBaseNode.localMatrix = mat4.mul(
                mat4.create(),
                this._transformBaseNode.localMatrix,
                invertedScale);
        }
        this._lastTransformOrientation = CurrentTransformOrientation.orientation;
    }

    _scaleTransformGizmoBoundingBox() {
        /* The transformation gizmo should be the same size regardless of how far the camera is from it.
           Here, we'll scale only the gizmo bounding boxes and allow the rescaling of the actual gizmo
           meshes to happen in the shader. We could rescale the meshes here as well, but then the
           transformation gizmo would not change size smoothly.
        */
        const objectPosition = mat4.getTranslation(vec3.create(), this._selectedObjectNode.localMatrix);
        const distance = vec3.distance(Camera.getPosition(), objectPosition);
        const scale = distance * TransformScaleFactor;
        for (let transformGizmoComponentNode of this._transformBaseNode.children) {
            if (transformGizmoComponentNode.children.length == 0) {
                continue; // The rotation gizmo black circle, for instance, has no bounding box
            }
            if (transformGizmoComponentNode.children.length > 1) {
                console.warn('Expected gizmo component to have no more than one child (a bounding box)');
            } else {
                const child = transformGizmoComponentNode.children[0];
                const currScale = mat4.getScaling(vec3.create(), child.localMatrix);
                transformGizmoComponentNode.children[0].applyScaling(mat4.fromScaling(mat4.create(),
                    vec3.fromValues(1.0/currScale[0] * scale, 1.0/currScale[1] * scale, 1.0/currScale[2] * scale)));
            }
        }
    }
}

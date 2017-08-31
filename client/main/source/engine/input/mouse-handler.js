/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import {Camera, getDefaultPerspectiveMatrixInverse} from '../camera/index'
import {gl} from '../gl'
import $ from 'jquery'
import {vec4} from 'gl-matrix'

gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

function handleLockChange() {
    if (isPointerLocked()) {
        $(document).on('mousemove', handleMouseMovement);
    } else {
        // No need to check mouse movement when pointer lock is not active
        $(document).off('mousemove', handleMouseMovement);
    }
}

function handleMouseMovement(e) {
    Camera.updateDirection(e.originalEvent.movementX, e.originalEvent.movementY);
}

function isPointerLocked() {
    return document.pointerLockElement === gl.canvas || document.mozPointerLockElement === gl.canvas;
}

// http://antongerdelan.net/opengl/raycasting.html
function handleMouseClick(mouseX, mouseY) {
    const rayWorld = getRayWorld(mouseX, mouseY);
    console.warn(rayWorld);
}

// http://antongerdelan.net/opengl/raycasting.html
function getRayWorld(mouseX, mouseY) {
    // Convert to normalized device space
    const ndsX = (2.0 * mouseX) / gl.canvas.clientWidth - 1.0;
    const ndsY = 1.0 - (2.0 * mouseY) / gl.canvas.clientHeight;

    // Convert to homogenous clip space
    const rayClip = vec4.fromValues(ndsX, ndsY, -1.0, 1.0);

    // Convert to eye space
    let rayEye = vec4.transformMat4(vec4.create(), rayClip, getDefaultPerspectiveMatrixInverse());
    rayEye = vec4.fromValues(rayEye[0], rayEye[1], -1.0, 0.0);

    // Convert to world space
    let rayWorld = vec4.transformMat4(vec4.create(), rayEye, Camera.getViewMatrixInverse());
    return vec4.normalize(vec4.create(), rayWorld);
}

export default {
    init() {
        gl.canvas.onclick = (e) => {
            handleMouseClick(e.clientX, e.clientY);
        }
        $(document).on('pointerlockchange', handleLockChange);
        $(document).on('mozpointerlockchange', handleLockChange);
    },

    /* Returns true if the pointer is currently locked. */
    isPointerLocked() {
        return isPointerLocked();
    }
}

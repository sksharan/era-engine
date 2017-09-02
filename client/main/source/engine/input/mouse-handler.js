/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import {Camera} from '../camera/index'
import {gl} from '../gl'
import {getWorldSpaceRay, testBoundingBoxIntersections} from './ray-intersection'
import $ from 'jquery'

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

function handleMouseClick(mouseX, mouseY) {
    const rayWorld = getWorldSpaceRay(mouseX, mouseY);
    testBoundingBoxIntersections(Camera.getPosition(), rayWorld);
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

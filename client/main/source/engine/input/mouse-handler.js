/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import camera from '../camera/camera'
import {gl} from '../gl'
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
    camera.updateDirection(e.originalEvent.movementX, e.originalEvent.movementY);
}

function isPointerLocked() {
    return document.pointerLockElement === gl.canvas || document.mozPointerLockElement === gl.canvas;
}

export default {
    /* Clicking the canvas will lock the pointer (press ESC to show the pointer again).
     * Listeners are applied to check when the pointer is locked/unlocked. */
    init() {
        gl.canvas.onclick = function() {
            gl.canvas.requestPointerLock();
        }
        $(document).on('pointerlockchange', handleLockChange);
        $(document).on('mozpointerlockchange', handleLockChange);
    },

    /* Returns true if the pointer is currently locked. */
    isPointerLocked() {
        return isPointerLocked();
    }
}

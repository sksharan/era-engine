/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import {NoneSelectedState} from './selection/index'
import {Camera} from '../camera/index'
import {gl} from '../gl'
import {RootSceneNode} from '../index'

gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

let currSelectionState = new NoneSelectedState();

function handleLockChange() {
    if (isPointerLocked()) {
        document.addEventListener('mousemove', handleMouseMovement);
    } else {
        // No need to check mouse movement when pointer lock is not active
        document.removeEventListener('mousemove', handleMouseMovement);
    }
}

function handleMouseMovement(e) {
    Camera.updateDirection(e.movementX, e.movementY);
}

function isPointerLocked() {
    return document.pointerLockElement === gl.canvas || document.mozPointerLockElement === gl.canvas;
}

function handleSelectionState(nextState) {
    if (nextState !== null) {
        currSelectionState.onExit(RootSceneNode);
        currSelectionState = nextState;
        currSelectionState.onEnter(RootSceneNode);
    }
}

export const MouseHandler = {
    init() {
        gl.canvas.addEventListener('mousedown', (e) => {
            if (!this.isPointerLocked()) {
                const nextState = currSelectionState.handleMouseDown(e.clientX, e.clientY, RootSceneNode);
                handleSelectionState(nextState);
            }
        });
        gl.canvas.addEventListener('mouseup', (e) => {
            if (!this.isPointerLocked()) {
                const nextState = currSelectionState.handleMouseUp(e.clientX, e.clientY, RootSceneNode);
                handleSelectionState(nextState);
            }
        });
        gl.canvas.addEventListener('mousemove', (e) => {
            if (!this.isPointerLocked()) {
                const nextState = currSelectionState.handleMouseMove(e.clientX, e.clientY, RootSceneNode);
                handleSelectionState(nextState);
            }
        });
        document.addEventListener('pointerlockchange', handleLockChange);
        document.addEventListener('mozpointerlockchange', handleLockChange);
    },
    isPointerLocked() {
        return isPointerLocked();
    },
    togglePointerLock() {
        gl.canvas.requestPointerLock();
    }
}

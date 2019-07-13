/* Handler for mouse/pointer input. Uses the Pointer Lock API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 */

import {CurrentHandlerState} from './handler-state';
import {Camera} from '../camera/index';
import {gl} from '../gl';
import {RootSceneNode} from '../index';

gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

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

export const MouseHandler = {
    init() {
        CurrentHandlerState.initListeners();
        document.addEventListener('click', e => {
            if (!isPointerLocked()) {
                const nextState = CurrentHandlerState.selectionState.handleDocumentClick(
                    e.clientX,
                    e.clientY,
                    RootSceneNode
                );
                CurrentHandlerState.selectionState = nextState;
            }
        });
        gl.canvas.addEventListener('mousedown', e => {
            if (!isPointerLocked()) {
                const nextState = CurrentHandlerState.selectionState.handleCanvasMouseDown(
                    e.clientX,
                    e.clientY,
                    RootSceneNode
                );
                CurrentHandlerState.selectionState = nextState;
            }
        });
        gl.canvas.addEventListener('mouseup', e => {
            if (!isPointerLocked()) {
                const nextState = CurrentHandlerState.selectionState.handleCanvasMouseUp(
                    e.clientX,
                    e.clientY,
                    RootSceneNode
                );
                CurrentHandlerState.selectionState = nextState;
            }
        });
        gl.canvas.addEventListener('mousemove', e => {
            if (!isPointerLocked()) {
                const nextState = CurrentHandlerState.selectionState.handleCanvasMouseMove(
                    e.clientX,
                    e.clientY,
                    RootSceneNode
                );
                CurrentHandlerState.selectionState = nextState;
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
};

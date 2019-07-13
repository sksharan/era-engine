import camera from '../camera/camera';
import {MouseHandler} from './mouse-handler';
import {CurrentHandlerState} from './handler-state';
import {RootSceneNode} from '../index';

// Maps key codes to boolean values indicating if key is pressed
const pressedKeys = {};

function handleKeyDown(e) {
    pressedKeys[e.which] = true;
    const nextState = CurrentHandlerState.selectionState.handleKeyDown(e.which, RootSceneNode);
    CurrentHandlerState.selectionState = nextState;
}

function handleKeyUp(e) {
    pressedKeys[e.which] = false;
    const nextState = CurrentHandlerState.selectionState.handleKeyUp(e.which, RootSceneNode);
    CurrentHandlerState.selectionState = nextState;
}

export const KeyboardHandler = {
    init() {
        CurrentHandlerState.initListeners();
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    },

    processKeys() {
        // "w"
        if (pressedKeys[87] && MouseHandler.isPointerLocked()) {
            camera.moveForward();
        }
        // "a"
        if (pressedKeys[65] && MouseHandler.isPointerLocked()) {
            camera.moveLeft();
        }
        // "s"
        if (pressedKeys[83] && MouseHandler.isPointerLocked()) {
            camera.moveBackward();
        }
        // "d"
        if (pressedKeys[68] && MouseHandler.isPointerLocked()) {
            camera.moveRight();
        }
    }
};

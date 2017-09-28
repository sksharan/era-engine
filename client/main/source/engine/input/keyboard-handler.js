import camera from '../camera/camera'
import {MouseHandler} from './mouse-handler'

// Maps key codes to boolean values indicating if key is pressed
const pressedKeys = {};

function handleKeyDown(e) {
    pressedKeys[e.which] = true;
}

function handleKeyUp(e) {
    pressedKeys[e.which] = false;
}

export const KeyboardHandler = {
    init() {
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
}

import camera from '../render/camera'
import {isPointerLocked} from './mouse-handler'

// Maps key codes to boolean values indicating if key is pressed
const pressedKeys = {};

function handleKeyDown(e) {
    // Take no action on keypress if pointer lock is not active
    if (!isPointerLocked()) {
        return;
    }
    pressedKeys[e.which] = true;
}

function handleKeyUp(e) {
    pressedKeys[e.which] = false;
}

export function processKeys() {
    // "W"
    if (pressedKeys[87]) {
        camera.moveForward();
    }
    // "A"
    if (pressedKeys[65]) {
        camera.moveLeft();
    }
    // "S"
    if (pressedKeys[83]) {
        camera.moveBackward();
    }
    // "D"
    if (pressedKeys[68]) {
        camera.moveRight();
    }
}

/* Set up listener to act on user keyboard input. */
export function init() {
    $(document).on('keydown', handleKeyDown);
    $(document).on('keyup', handleKeyUp);
}

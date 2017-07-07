import camera from '../camera/camera'
import MouseHandler from './mouse-handler'

// Maps key codes to boolean values indicating if key is pressed
const pressedKeys = {};

function handleKeyDown(e) {
    // Take no action on keypress if pointer lock is not active
    if (!MouseHandler.isPointerLocked()) {
        return;
    }
    pressedKeys[e.which] = true;
}

function handleKeyUp(e) {
    pressedKeys[e.which] = false;
}

export default {
    init() {
        $(document).on('keydown', handleKeyDown);
        $(document).on('keyup', handleKeyUp);
    },

    processKeys() {
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
}

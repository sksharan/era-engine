import camera from '../camera/camera'
import MouseHandler from './mouse-handler'
import {gl} from '../gl'

// Maps key codes to boolean values indicating if key is pressed
const pressedKeys = {};

function handleKeyDown(e) {
    pressedKeys[e.which] = true;

    // "m"
    if (pressedKeys[77]) {
        gl.canvas.requestPointerLock();
    }
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

'use strict';

const camera = require('../render/camera');
const mouseHandler = require('./mouse-handler');
const $ = require('jquery');

// Maps key codes to boolean values indicating if key is pressed
const pressedKeys = {};

function handleKeyDown(e) {
    // Take no action on keypress if pointer lock is not active
    if (!mouseHandler.isPointerLocked()) {
        return;
    }
    pressedKeys[e.which] = true;
}

function handleKeyUp(e) {
    pressedKeys[e.which] = false;
}

function processKeys() {
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

module.exports = {
    /* Set up listener to act on user keyboard input. */
    init: function() {
        $(document).on('keydown', handleKeyDown);
        $(document).on('keyup', handleKeyUp);
    },
    /* Act on currently pressed keys. */
    processKeys: processKeys
}

'use strict';

var glMatrix = require('gl-matrix').glMatrix;
var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

function Camera() {
    /* Camera position */
    this.position = vec3.fromValues(0, 0, 5);

    /* Direction the camera is facing */
    this.direction = vec3.fromValues(0, 0, -1);

    /* Camera up vector */
    this.up = vec3.fromValues(0, 1, 0);

    /* Camera right vector */
    this.right = vec3.fromValues(1, 0, 0);

    /* Camera yaw and pitch components */
    this.yaw = -90.0;
    this.pitch = 0.0;

    /* Controls look-around speed of the camera */
    this.lookAroundSpeed = 0.1;

    /* Camera movement speed */
    this.movementSpeed = 2.0;
}

Camera.prototype.getPosition = function() {
    return this.position;
}

/* Given the number of pixels the mouse has moved in the x and y
 * directions, updates the direction of the camera. */
Camera.prototype.updateDirection = function(movementX, movementY) {
    movementX *= this.lookAroundSpeed;
    movementY *= this.lookAroundSpeed;
    this.yaw += movementX;
    this.pitch -= movementY;

    // Prevent camera from moving upside down
    if (this.pitch > 89.0) {
        this.pitch = 89.0;
    }
    if (this.pitch < -89.0) {
        this.pitch = -89.0;
    }

    // More of this computation explained here: https://learnopengl.com/#!Getting-started/Camera
    this.direction[0] = Math.cos(glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.toRadian(this.pitch));
    this.direction[1] = Math.sin(glMatrix.toRadian(this.pitch));
    this.direction[2] = Math.sin(glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.toRadian(this.pitch));
    this.direction = vec3.normalize(vec3.create(), this.direction);

    // Recompute right vecotr since direction was updated
    this.right = vec3.cross(vec3.create(), this.direction, this.up);
    this.right = vec3.normalize(vec3.create(), this.right);
}

// Camera movement functions
Camera.prototype.moveForward = function() {
    this.position = vec3.add(vec3.create(), this.position,
            vec3.scale(vec3.create(), this.direction, this.movementSpeed));
}
Camera.prototype.moveBackward = function() {
    this.position = vec3.sub(vec3.create(), this.position,
            vec3.scale(vec3.create(), this.direction, this.movementSpeed));
}
Camera.prototype.moveRight = function() {
    this.position = vec3.add(vec3.create(), this.position,
            vec3.scale(vec3.create(), this.right, this.movementSpeed));
}
Camera.prototype.moveLeft = function() {
    this.position = vec3.sub(vec3.create(), this.position,
            vec3.scale(vec3.create(), this.right, this.movementSpeed));
}

Camera.prototype.getViewMatrix = function() {
    return mat4.lookAt(mat4.create(), this.position, vec3.add(vec3.create(), this.position, this.direction), this.up);
}

module.exports = new Camera();

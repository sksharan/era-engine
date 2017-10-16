import {glMatrix, mat4, vec3} from 'gl-matrix'

class Camera {
    constructor() {
        /* Camera position */
        this.position = vec3.fromValues(-145.67300415039062, 158.8555908203125, 217.2246551513672);

        /* Direction the camera is facing */
        this.direction = vec3.fromValues(0.6006218194961548, -0.44775909185409546, -0.6623935699462891);

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

    getPosition() {
        return this.position;
    }

    /* Given the number of pixels the mouse has moved in the x and y
     * directions, updates the direction of the camera. */
    updateDirection(movementX, movementY) {
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

    moveForward() {
        this.position = vec3.add(vec3.create(), this.position,
                vec3.scale(vec3.create(), this.direction, this.movementSpeed));
    }

    moveBackward() {
        this.position = vec3.sub(vec3.create(), this.position,
                vec3.scale(vec3.create(), this.direction, this.movementSpeed));
    }

    moveRight() {
        this.position = vec3.add(vec3.create(), this.position,
                vec3.scale(vec3.create(), this.right, this.movementSpeed));
    }

    moveLeft() {
        this.position = vec3.sub(vec3.create(), this.position,
                vec3.scale(vec3.create(), this.right, this.movementSpeed));
    }

    getViewMatrix() {
        return mat4.lookAt(mat4.create(), this.position,
                vec3.add(vec3.create(), this.position, this.direction), this.up);
    }

    getViewMatrixInverse() {
        return mat4.invert(mat4.create(), this.getViewMatrix());
    }
}

export default new Camera();

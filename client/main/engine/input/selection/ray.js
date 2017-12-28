import {Camera, getDefaultPerspectiveMatrixInverse} from '../../camera/index'
import {gl} from '../../gl'
import {vec4} from 'gl-matrix'

export class Ray {
    constructor(origin, direction) {
        if (!(origin instanceof Float32Array)) {
            throw new TypeError('Origin must be a vec3 (Float32Array)');
        }
        if (!(direction instanceof Float32Array)) {
            throw new TypeError('Origin must be a vec3 (Float32Array)');
        }
        this._origin = origin;
        this._direction = direction;
    }
    get origin() {
        return this._origin;
    }
    get direction() {
        return this._direction;
    }
}

// http://antongerdelan.net/opengl/raycasting.html
export const toRay = (mouseX, mouseY) => {
    // Convert to normalized device space
    const ndsX = (2.0 * mouseX) / gl.canvas.clientWidth - 1.0;
    const ndsY = 1.0 - (2.0 * mouseY) / gl.canvas.clientHeight;

    // Convert to homogenous clip space
    const rayClip = vec4.fromValues(ndsX, ndsY, -1.0, 1.0);

    // Convert to eye space
    let rayEye = vec4.transformMat4(vec4.create(), rayClip, getDefaultPerspectiveMatrixInverse());
    rayEye = vec4.fromValues(rayEye[0], rayEye[1], -1.0, 0.0);

    // Convert to world space
    let rayWorld = vec4.transformMat4(vec4.create(), rayEye, Camera.getViewMatrixInverse());

    let origin = Camera.getPosition();
    let direction = vec4.normalize(vec4.create(), rayWorld);
    return new Ray(origin, direction);
}

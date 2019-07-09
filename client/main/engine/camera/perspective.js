import {gl} from '../gl';
import {glMatrix, mat4} from 'gl-matrix';

const fovy = glMatrix.toRadian(45.0);
const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
const near = 0.1;
const far = 2500.0;
const perspectiveMatrix = mat4.perspective(mat4.create(), fovy, aspectRatio, near, far);
const inversePerspectiveMatrix = mat4.invert(mat4.create(), perspectiveMatrix);

export const getDefaultPerspectiveMatrix = () => {
    return perspectiveMatrix;
};

export const getDefaultPerspectiveMatrixInverse = () => {
    return inversePerspectiveMatrix;
};

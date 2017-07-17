import {Camera} from '../camera/index'
import {gl} from '../gl'
import {glMatrix, mat4} from 'gl-matrix'

export default class ProgramDataState {
    constructor() {
        this._state = {};

        const fovy = glMatrix.toRadian(45.0);
        const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        const near = 0.1;
        const far = 2500.0;
        this._projectionMatrix = mat4.perspective(mat4.create(), fovy, aspectRatio, near, far);
    }

    clear() {
        this._state = {};
    }

    contains(programData) {
        return this._state.hasOwnProperty(programData.id);
    }

    put(programData) {
        if (!this.contains(programData)) {
            if (programData.hasProjectionMatrixUniformLocation()) {
                gl.uniformMatrix4fv(programData.projectionMatrixUniformLocation, gl.FALSE, this._projectionMatrix);
            }
            if (programData.hasViewMatrixUniformLocation()) {
                gl.uniformMatrix4fv(programData.viewMatrixUniformLocation, gl.FALSE, Camera.getViewMatrix());
            }
            if (programData.hasCameraPositionUniformLocation()) {
                gl.uniform3fv(programData.cameraPositionUniformLocation, Camera.getPosition());
            }
        }

        this._state[programData.id] = programData.program;
    }

}

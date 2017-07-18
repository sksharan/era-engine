import {Camera} from '../camera/index'
import {ProgramBuilder} from '../shader/index'
import {gl} from '../gl'
import {glMatrix, mat4, vec3} from 'gl-matrix'

export default class ProgramDataManager {
    constructor() {
        const fovy = glMatrix.toRadian(45.0);
        const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        const near = 0.1;
        const far = 2500.0;
        this._projectionMatrix = mat4.perspective(mat4.create(), fovy, aspectRatio, near, far);
    }

    initCameraUniforms(programData) {
        gl.useProgram(programData.program);

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

    initLightUniforms(programData, lightNodes) {
        if (!programData.lightEnabled) {
            return;
        }

        updateProgramData(programData, lightNodes); // Changes the underlying GL program
        gl.useProgram(programData.program);

        for (let lightNode of lightNodes) {
            const light = lightNode.light;
            gl.uniform3fv(gl.getUniformLocation(programData.program, `point${light.id}PositionWorld`),
                    mat4.getTranslation(vec3.create(), lightNode.worldMatrix));

            gl.uniform4fv(gl.getUniformLocation(programData.program, `point${light.id}Ambient`),
                    [light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a]);

            gl.uniform4fv(gl.getUniformLocation(programData.program, `point${light.id}Diffuse`),
                    [light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a]);

            gl.uniform4fv(gl.getUniformLocation(programData.program, `point${light.id}Specular`),
                    [light.specular.r, light.specular.g, light.specular.b, light.specular.a]);

            gl.uniform1f(gl.getUniformLocation(programData.program, `point${light.id}SpecularTerm`), light.specularTerm);
            gl.uniform1f(gl.getUniformLocation(programData.program, `point${light.id}ConstantAttenuation`), light.constantAttenuation);
            gl.uniform1f(gl.getUniformLocation(programData.program, `point${light.id}LinearAttenuation`), light.linearAttenuation);
            gl.uniform1f(gl.getUniformLocation(programData.program, `point${light.id}QuadraticAttenuation`), light.quadraticAttenuation);
        }
    }

}

function updateProgramData(programData, lightNodes) {
    let builder = new ProgramBuilder();

    if (programData.billboardEnabled) {
        builder = builder.addBillboardPosition();
    } else {
        builder = builder.addPosition();
    }
    builder = builder.addNormal().enableLighting();

    for (let lightNode of lightNodes) {
        builder = builder.addPointLight(lightNode.light.id);
    }
    programData.update(builder.build());
}

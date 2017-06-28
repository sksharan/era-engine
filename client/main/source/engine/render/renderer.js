import camera from '../camera/camera'
import {gl} from '../gl'
import {glMatrix, mat4} from 'gl-matrix'

function initRender() {
    resizeCanvas();
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.clearColor(0.85, 0.85, 0.85, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Based on https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resizeCanvas() {
    const displayWidth = gl.canvas.clientWidth;
    const displayHeight = gl.canvas.clientHeight;

    if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
    }
}

function renderNode(sceneNode) {
    if (sceneNode.hasMesh() && sceneNode.hasMaterial()) {
        const mesh = sceneNode.mesh;
        const material = sceneNode.material;

        if (material.programData.program !== this._lastProgram) {
            gl.useProgram(material.programData.program);
            this.lastProgram = material.programData.program;
        }

        if (material.programData.hasPositionAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getPositionBuffer());
            gl.vertexAttribPointer(material.programData.positionAttributeLocation, mesh.getFloatsPerVertex(),
                gl.FLOAT, false, 0, 0);
        }
        if (material.programData.hasNormalAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.normalAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getNormalBuffer());
            gl.vertexAttribPointer(material.programData.normalAttributeLocation, mesh.getFloatsPerNormal(),
                gl.FLOAT, false, 0, 0);
        }
        if (material.programData.hasTexcoordAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.texcoordAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getTexcoordBuffer());
            gl.vertexAttribPointer(material.programData.texcoordAttributeLocation, mesh.getFloatsPerTexcoord(),
                gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());

        if (material.programData.hasModelMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.programData.modelMatrixUniformLocation, gl.FALSE, sceneNode.worldMatrix);
        }
        if (material.programData.hasViewMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.programData.viewMatrixUniformLocation, gl.FALSE, camera.getViewMatrix());
        }
        if (material.programData.hasProjectionMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.programData.projectionMatrixUniformLocation, gl.FALSE,
                    mat4.perspective(mat4.create(), glMatrix.toRadian(45.0), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 2500.0));
        }
        if (material.programData.hasNormalMatrixUniformLocation()) {
            gl.uniformMatrix3fv(material.programData.normalMatrixUniformLocation, gl.FALSE, sceneNode.normalMatrix);
        }
        if (material.programData.hasCameraPositionUniformLocation()) {
            gl.uniform3fv(material.programData.cameraPositionUniformLocation, camera.getPosition());
        }

        gl.bindTexture(gl.TEXTURE_2D, material.texture);

        gl.drawElements(gl.TRIANGLES, mesh.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }

    sceneNode.children.forEach(renderNode, this);
}

class Renderer {
    constructor() {
        // The last program used to render a node
        this._lastProgram = null;
    }

    render(sceneNode) {
        initRender();
        renderNode.call(this, sceneNode);
    }
}

export default new Renderer();

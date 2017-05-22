import camera from './camera'
import {gl} from '../gl'
import {glMatrix, mat4} from 'gl-matrix'

function initRender() {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function renderNode(sceneNode) {
    if (sceneNode.hasMesh() && sceneNode.hasMaterial()) {
        const mesh = sceneNode.getMesh();
        const material = sceneNode.getMaterial();

        if (material.getProgramData().getProgram() !== this.lastProgram) {
            gl.useProgram(material.getProgramData().getProgram());
            this.lastProgram = material.getProgramData().getProgram();
        }

        if (material.getProgramData().hasPositionAttributeLocation()) {
            gl.enableVertexAttribArray(material.getProgramData().getPositionAttributeLocation());
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getPositionBuffer());
            gl.vertexAttribPointer(material.getProgramData().getPositionAttributeLocation(), mesh.getFloatsPerVertex(),
                gl.FLOAT, false, 0, 0);
        }
        if (material.getProgramData().hasNormalAttributeLocation()) {
            gl.enableVertexAttribArray(material.getProgramData().getNormalAttributeLocation());
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getNormalBuffer());
            gl.vertexAttribPointer(material.getProgramData().getNormalAttributeLocation(), mesh.getFloatsPerNormal(),
                gl.FLOAT, false, 0, 0);
        }
        if (material.getProgramData().hasTexcoordAttributeLocation()) {
            gl.enableVertexAttribArray(material.getProgramData().getTexcoordAttributeLocation());
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getTexcoordBuffer());
            gl.vertexAttribPointer(material.getProgramData().getTexcoordAttributeLocation(), mesh.getFloatsPerTexcoord(),
                gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());

        if (material.getProgramData().hasModelMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.getProgramData().getModelMatrixUniformLocation(), gl.FALSE, sceneNode.getWorldMatrix());
        }
        if (material.getProgramData().hasViewMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.getProgramData().getViewMatrixUniformLocation(), gl.FALSE, camera.getViewMatrix());
        }
        if (material.getProgramData().hasProjectionMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.getProgramData().getProjectionMatrixUniformLocation(), gl.FALSE,
                    mat4.perspective(mat4.create(), glMatrix.toRadian(45.0), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 2500.0));
        }
        if (material.getProgramData().hasNormalMatrixUniformLocation()) {
            gl.uniformMatrix3fv(material.getProgramData().getNormalMatrixUniformLocation(), gl.FALSE, sceneNode.getNormalMatrix());
        }
        if (material.getProgramData().hasCameraPositionUniformLocation()) {
            gl.uniform3fv(material.getProgramData().getCameraPositionUniformLocation(), camera.getPosition());
        }

        gl.bindTexture(gl.TEXTURE_2D, material.getTexture());

        gl.drawElements(gl.TRIANGLES, mesh.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }

    sceneNode.children.forEach(renderNode, this);
}

class Renderer {
    constructor() {
        // The last program used to render a node
        this.lastProgram = null;
    }

    render(sceneNode) {
        initRender();
        renderNode.call(this, sceneNode);
    }
}

export default new Renderer();

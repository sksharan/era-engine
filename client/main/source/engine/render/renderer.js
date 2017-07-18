import ProgramDataManager from './program-data-manager'
import NodeAnalyzer from './node-analyzer'
import {gl} from '../gl'
import {vec3} from 'gl-matrix'

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
    this._cachedProgramData = null;
    this._nodeAnalyzer.analyze(sceneNode);

    const lightNodes = this._nodeAnalyzer.getAllLightNodes();
    const allProgramData = this._nodeAnalyzer.getAllProgramData();

    for (let programData of allProgramData) {
        this._programDataManager.initCameraUniforms(programData);
        if (this._lastNumLights !== lightNodes.length) {
            this._programDataManager.initLightUniforms(programData, lightNodes);
        }
    }
    this._lastNumLights = lightNodes.length;

    renderGeometry.call(this, sceneNode, lightNodes);
}

function renderGeometry(sceneNode, lightNodes) {
    if (sceneNode.nodeType === "GEOMETRY") {
        const mesh = sceneNode.mesh;
        const material = sceneNode.material;

        if (material.programData !== this._cachedProgramData) {
            this._cachedProgramData = material.programData;
            gl.useProgram(this._cachedProgramData.program);
        }

        if (material.programData.hasPositionAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
            gl.vertexAttribPointer(material.programData.positionAttributeLocation, mesh.floatsPerVertex, gl.FLOAT, false, 0, 0);
        }
        if (material.programData.hasNormalAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.normalAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
            gl.vertexAttribPointer(material.programData.normalAttributeLocation, mesh.floatsPerNormal, gl.FLOAT, false, 0, 0);
        }
        if (material.programData.hasTexcoordAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.texcoordAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texcoordBuffer);
            gl.vertexAttribPointer(material.programData.texcoordAttributeLocation, mesh.floatsPerTexcoord, gl.FLOAT, false, 0, 0);
        }

        if (mesh.hasIndices()) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        }

        if (material.programData.hasModelMatrixUniformLocation()) {
            gl.uniformMatrix4fv(material.programData.modelMatrixUniformLocation, gl.FALSE, sceneNode.worldMatrix);
        }
        if (material.programData.hasNormalMatrixUniformLocation()) {
            gl.uniformMatrix3fv(material.programData.normalMatrixUniformLocation, gl.FALSE, sceneNode.normalMatrix);
        }
        if (material.programData.hasCenterPositionUniformLocation()) {
            gl.uniform3fv(material.programData.centerPositionUniformLocation,
                vec3.transformMat4(vec3.create(), vec3.create(), sceneNode.worldMatrix));
        }

        gl.bindTexture(gl.TEXTURE_2D, material.texture);

        if (mesh.hasIndices()) {
            gl.drawElements(mesh.drawMode, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mesh.drawMode, 0, mesh.numVertices / 3);
        }
    }

    for (let child of sceneNode.children) {
        renderGeometry.call(this, child, lightNodes);
    }
}

class Renderer {
    constructor() {
        this._cachedProgramData = null;
        this._programDataManager = new ProgramDataManager();
        this._nodeAnalyzer = new NodeAnalyzer();
        this._lastNumLights = 0;
    }

    render(sceneNode) {
        initRender();
        renderNode.call(this, sceneNode);
    }
}

export default new Renderer();

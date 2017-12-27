import ProgramDataManager from './program-data-manager'
import {NodeAnalyzer, RenderNodeType} from '../node/index'
import {gl} from '../gl'
import {NumFloatsPerPosition, NumFloatsPerNormal, NumFloatsPerTexcoord} from '../mesh/index'

const vertexBufferStride = NumFloatsPerPosition + NumFloatsPerNormal + NumFloatsPerTexcoord;

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
        if (this._nodeAnalyzer.lightsChanged()) {
            this._programDataManager.initLightUniforms(programData, lightNodes); // Changes GL program
        }
        this._programDataManager.initCameraUniforms(programData);
    }

    renderGeometry.call(this, sceneNode, lightNodes, true);

    // https://stackoverflow.com/questions/5526704/how-do-i-keep-an-object-always-in-front-of-everything-else-in-opengl
    gl.clear(gl.DEPTH_BUFFER_BIT);
    const ignoreDepthNodes = this._nodeAnalyzer.getAllIgnoreDepthNodes();
    for (let ignoreDepthNode of ignoreDepthNodes) {
        renderGeometry.call(this, ignoreDepthNode, lightNodes, false);
    }
}

function renderGeometry(sceneNode, lightNodes, skipIgnoreDepthNodes) {
    if (sceneNode.nodeType === RenderNodeType.REFERENCE) {
        // TODO
    }
    if (sceneNode.nodeType === RenderNodeType.GEOMETRY && sceneNode.material.isVisible) {
        const mesh = sceneNode.mesh;
        const material = sceneNode.material;

        if (material.ignoreDepth && skipIgnoreDepthNodes) {
            return;
        }

        if (material.programData !== this._cachedProgramData) {
            this._cachedProgramData = material.programData;
            gl.useProgram(this._cachedProgramData.program);
        }

        if (material.programData.hasPositionAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            gl.vertexAttribPointer(material.programData.positionAttributeLocation, 3, gl.FLOAT, false,
                vertexBufferStride * 4, 0);
        }
        if (material.programData.hasNormalAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.normalAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            gl.vertexAttribPointer(material.programData.normalAttributeLocation, 3, gl.FLOAT, false,
                vertexBufferStride * 4, NumFloatsPerPosition * 4);
        }
        if (material.programData.hasTexcoordAttributeLocation()) {
            gl.enableVertexAttribArray(material.programData.texcoordAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            gl.vertexAttribPointer(material.programData.texcoordAttributeLocation, 2, gl.FLOAT, false,
                vertexBufferStride * 4, (NumFloatsPerPosition + NumFloatsPerNormal) * 4);
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
        if (material.programData.hasColorUniformLocation()) {
            gl.uniform4fv(material.programData.colorUniformLocation, material.color);
        }

        if (material.texture) {
            gl.bindTexture(gl.TEXTURE_2D, material.texture);
        }

        if (mesh.hasIndices()) {
            gl.drawElements(mesh.drawMode, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mesh.drawMode, 0, mesh.numVertices / 3);
        }
    }

    for (let child of sceneNode.children) {
        renderGeometry.call(this, child, lightNodes, skipIgnoreDepthNodes);
    }
}

class Renderer {
    constructor() {
        this._cachedProgramData = null;
        this._programDataManager = new ProgramDataManager();
        this._nodeAnalyzer = new NodeAnalyzer();
    }

    render(sceneNode) {
        initRender();
        renderNode.call(this, sceneNode);
    }
}

export default new Renderer();

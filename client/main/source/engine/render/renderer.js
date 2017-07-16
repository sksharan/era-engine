import {Camera} from '../camera/index'
import {ProgramBuilder} from '../shader/index'
import {gl} from '../gl'
import {glMatrix, mat4, vec3} from 'gl-matrix'

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
    // Figure out which light nodes are influencing the scene
    // http://math.hws.edu/graphicsbook/c4/s4.html - see "Moving Light"
    this._lightNodes = [];
    getLightNodes(sceneNode, this._lightNodes);

    this._programMap = {};

    renderGeometry.call(this, sceneNode);
}

function getLightNodes(sceneNode, lightNodes) {
    if (sceneNode.nodeType === "LIGHT") {
        lightNodes.push(sceneNode);
    }
    for (let child of sceneNode.children) {
        getLightNodes(child, lightNodes);
    }
}

function renderGeometry(sceneNode) {
    if (sceneNode.nodeType === "GEOMETRY") {
        const mesh = sceneNode.mesh;
        const material = sceneNode.material;

        const programDataChanged = material.programData !== this._cachedProgramData;
        const numLightsChanged = this._lightNodes.length !== this._lastNumLights;

        if (programDataChanged || numLightsChanged) {
            this._cachedProgramData = material.programData;
            updateProgramDataLights(this._cachedProgramData, this._lightNodes); // Changes the underlying GL program
            gl.useProgram(this._cachedProgramData.program);
            updateLightUniforms(this._cachedProgramData, this._lightNodes);

            updateProgramMap.call(this, this._cachedProgramData);
            this._lastNumLights = this._lightNodes.length;
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
        renderGeometry.call(this, child);
    }
}

function updateProgramMap(programData) {
    if (this._programMap.hasOwnProperty(programData.id)) {
        return;
    }
    this._programMap[programData.id] = {enabled:true};

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

function updateProgramDataLights(programData, lightNodes) {
    if (!programData.lightEnabled) {
        return;
    }

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

function updateLightUniforms(programData, lightNodes) {
    if (!programData.lightEnabled) {
        return;
    }
    const program = programData.program;

    for (let lightNode of lightNodes) {
        const light = lightNode.light;
        gl.uniform3fv(gl.getUniformLocation(program, `point${light.id}PositionWorld`),
                mat4.getTranslation(vec3.create(), lightNode.worldMatrix));

        gl.uniform4fv(gl.getUniformLocation(program, `point${light.id}Ambient`),
            [light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a]);

        gl.uniform4fv(gl.getUniformLocation(program, `point${light.id}Diffuse`),
            [light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a]);

        gl.uniform4fv(gl.getUniformLocation(program, `point${light.id}Specular`),
            [light.specular.r, light.specular.g, light.specular.b, light.specular.a]);

        gl.uniform1f(gl.getUniformLocation(program, `point${light.id}SpecularTerm`), light.specularTerm);
        gl.uniform1f(gl.getUniformLocation(program, `point${light.id}ConstantAttenuation`), light.constantAttenuation);
        gl.uniform1f(gl.getUniformLocation(program, `point${light.id}LinearAttenuation`), light.linearAttenuation);
        gl.uniform1f(gl.getUniformLocation(program, `point${light.id}QuadraticAttenuation`), light.quadraticAttenuation);
    }
}

class Renderer {
    constructor() {
        // Cache last program data used so that we only call gl.useProgram() when necessary
        this._cachedProgramData = null;
        // Number of light nodes used when rendering the last frame
        this._lastNumLights = 0;
        // Programs used for rendering this frame
        this._programMap = {};

        // Projection matrix
        const fovy = glMatrix.toRadian(45.0);
        const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        const near = 0.1;
        const far = 2500.0;
        this._projectionMatrix = mat4.perspective(mat4.create(), fovy, aspectRatio, near, far);
    }

    render(sceneNode) {
        initRender();
        renderNode.call(this, sceneNode);
    }
}

export default new Renderer();

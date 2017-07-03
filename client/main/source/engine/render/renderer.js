import camera from '../camera/camera'
import ProgramBuilder from '../shader/program-builder'
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
    let lightNodes = [];
    // http://math.hws.edu/graphicsbook/c4/s4.html - see "Moving Light"
    getLightNodes(sceneNode, lightNodes);
    renderGeometry.call(this, sceneNode, lightNodes);
}

// Get the light nodes that are influencing the scene
function getLightNodes(sceneNode, lightNodes=[]) {
    if (sceneNode.nodeType === "LIGHT") {
        lightNodes.push(sceneNode);
    }
    for (let child of sceneNode.children) {
        getLightNodes(child, lightNodes);
    }
}

// Render the meshes, taking into account all active light nodes
function renderGeometry(sceneNode, lightNodes) {
    if (sceneNode.nodeType === "GEOMETRY") {
        const mesh = sceneNode.mesh;
        const material = sceneNode.material;

        // For performance, no need to attach a new program if it's the same program used the render the previous node
        if (material.programData !== this._lastProgramData) {
            updateProgramData(material.programData, lightNodes);
            gl.useProgram(material.programData.program);
            updateLightUniforms(material.programData.program, lightNodes);
            this._lastProgramData = material.programData;
        }

        // Attribute binding
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

        // Uniform binding
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

        // Texture binding
        gl.bindTexture(gl.TEXTURE_2D, material.texture);

        // Finally, render the node
        gl.drawElements(gl.TRIANGLES, mesh.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }

    for (let child of sceneNode.children) {
        renderGeometry.call(this, child, lightNodes);
    }
}

function updateProgramData(programData, lightNodes) {
    let builder = new ProgramBuilder()
        .addPosition()
        .addNormal()
        .enableLighting();
    for (let lightNode of lightNodes) {
        builder = builder.addPointLight(lightNode.light.id);
    }
    programData.update(builder.build());
}

function updateLightUniforms(program, lightNodes) {
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
        this._lastProgramData = null;
    }

    render(sceneNode) {
        initRender();
        renderNode.call(this, sceneNode);
    }
}

export default new Renderer();

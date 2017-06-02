import {gl} from '../gl'
import ProgramData from './program-data'
import ShaderBuilder from './shader-builder'

/* Creates shaders from the given source code, links the shaders into a program,
 * and returns the created program. */
function createProgram(vertexShaderSourceCode, fragmentShaderSourceCode) {
    const program = gl.createProgram();
    gl.attachShader(program, createVertexShader(vertexShaderSourceCode));
    gl.attachShader(program, createFragmentShader(fragmentShaderSourceCode));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error('Error linking program:\n\n' + info);
    }
    return program;
}
function createVertexShader(vertexShaderSourceCode) {
    return createShader(gl.VERTEX_SHADER, vertexShaderSourceCode);
}
function createFragmentShader(fragmentShaderSourceCode) {
    return createShader(gl.FRAGMENT_SHADER, fragmentShaderSourceCode);
}
function createShader(type, shaderSourceCode) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        const typeName = (type == gl.VERTEX_SHADER) ? 'vertex' : 'fragment';
        throw new Error('Error compiling ' + typeName + ' shader:\n' + info);
    }
    return shader;
}

export default class ProgramBuilder {
    constructor() {
        this.programData = new ProgramData();
        this.vertBuilder = new ShaderBuilder();
        this.fragBuilder = new ShaderBuilder();

        this.vertBuilder.addMainFunctionLine('gl_Position = vec4(0, 0, 0, 1);');

        this.fragBuilder.addMainFunctionLine('vec4 fragColor = vec4(0, 0, 0, 0);');
    }

    addPosition() {
        this.vertBuilder.addAttributeLine('attribute vec3 position;')
                        .addUniformLine('uniform mat4 modelMatrix;')
                        .addUniformLine('uniform mat4 viewMatrix;')
                        .addUniformLine('uniform mat4 projectionMatrix;')
                        .addVaryingLine('varying vec4 vPositionWorld;')
                        .addMainFunctionLine('vPositionWorld = modelMatrix * vec4(position, 1.0);')
                        .addMainFunctionLine('gl_Position = projectionMatrix * viewMatrix * vPositionWorld;');

        this.fragBuilder.addVaryingLine('varying vec4 vPositionWorld;');

        return this;
    }

    // Requires addPosition() to be called first
    addNormal() {
        this.vertBuilder.addAttributeLine('attribute vec3 normal;')
                        .addUniformLine('uniform mat3 normalMatrix;')
                        .addVaryingLine('varying vec3 vNormalWorld;')
                        .addMainFunctionLine('vNormalWorld = normalMatrix * normal;');

        this.fragBuilder.addVaryingLine('varying vec3 vNormalWorld;');

        return this;
    }

    // Requires addPosition() to be called first
    addTexcoord() {
        this.vertBuilder.addAttributeLine('attribute vec2 texcoord;')
                        .addVaryingLine('varying vec2 vTexcoord;')
                        .addMainFunctionLine('vTexcoord = texcoord;');

        this.fragBuilder.addUniformLine('uniform sampler2D texture;')
                        .addVaryingLine('varying vec2 vTexcoord;')
                        .addMainFunctionLine('fragColor += texture2D(texture, vTexcoord);');

        return this;
    }

    // Requires addPosition() and addNormal() to be called first
    addPhongLighting() {
        this.fragBuilder.addUniformLine('uniform vec3 cameraPosition;');
        this.fragBuilder.addVariableLine(
            `vec3 lightPositionWorld = vec3(60, 20, 60);
            vec3 lightAmbient = vec3(0.1, 0.1, 0.1);
            vec3 lightDiffuse = vec3(0.8, 0.8, 0.8);
            vec3 lightSpecular = vec3(0.8, 0.6, 0.6);
            float specularTerm = 100.0;
            vec3 materialAmbient = vec3(0.1, 0.1, 0.1);
            vec3 materialDiffuse = vec3(0.5, 0.5, 0.5);
            vec3 materialSpecular = vec3(0.8, 0.8, 0.8);`);
        this.fragBuilder.addMainFunctionLine(
            `
            // Apply ambient lighting
            fragColor += vec4(lightAmbient, 1.0) * vec4(materialAmbient, 1.0);

            // Set up vectors for diffuse and specular calculations
            vec3 lightDirection = normalize(lightPositionWorld - vec3(vPositionWorld));
            vec3 lightReflect = reflect(-lightDirection, vNormalWorld);
            vec3 viewerDirection = normalize(cameraPosition - vec3(vPositionWorld));

            // Apply diffuse lighting
            fragColor += vec4(lightDiffuse, 1.0) * vec4(materialDiffuse, 1.0)
                        * max(0.0, dot(vNormalWorld, lightDirection));

            // Apply specular lighting
            fragColor += vec4(lightSpecular, 1.0) * vec4(materialSpecular, 1.0)
                        * pow(max(0.0, dot(viewerDirection, lightReflect)), specularTerm);`);

            return this;
    }

    build() {
        this.fragBuilder.setPrecisionLine('precision mediump float;');
        this.fragBuilder.addMainFunctionLine('gl_FragColor = fragColor;');

        const program = createProgram(this.vertBuilder.build(), this.fragBuilder.build());
        this.programData.setProgram(program);

        this.programData.setPositionAttributeLocation(gl.getAttribLocation(program, 'position'));
        this.programData.setNormalAttributeLocation(gl.getAttribLocation(program, 'normal'));
        this.programData.setTexcoordAttributeLocation(gl.getAttribLocation(program, 'texcoord'));

        this.programData.setModelMatrixUniformLocation(gl.getUniformLocation(program, 'modelMatrix'));
        this.programData.setViewMatrixUniformLocation(gl.getUniformLocation(program, 'viewMatrix'));
        this.programData.setProjectionMatrixUniformLocation(gl.getUniformLocation(program, 'projectionMatrix'));
        this.programData.setNormalMatrixUniformLocation(gl.getUniformLocation(program, 'normalMatrix'));
        this.programData.setCameraPositionUniformLocation(gl.getUniformLocation(program, 'cameraPosition'));

        return this.programData;
    }
}

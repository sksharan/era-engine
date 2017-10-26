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
        this._programData = new ProgramData();
        this._vertBuilder = new ShaderBuilder();
        this._fragBuilder = new ShaderBuilder();
        this._lightEnabled = false;
        this._billboardEnabled = false;
        this._positionScaleFactor = null;

        this._vertBuilder.addMainFunctionLines('gl_Position = vec4(0, 0, 0, 1);');

        this._fragBuilder.addMainFunctionLines('vec4 fragColor = vec4(0, 0, 0, 1);');
    }

    addPosition({scaleFactor=null} = {}) {
        this._vertBuilder.addAttributeLines('attribute vec3 position;')
                         .addUniformLines('uniform mat4 modelMatrix;')
                         .addUniformLines('uniform mat4 viewMatrix;')
                         .addUniformLines('uniform mat4 projectionMatrix;')
                         .addVaryingLines('varying vec4 vPositionWorld;');
        // vPositionWorld
        if (scaleFactor) {
            // https://www.opengl.org/discussion_boards/showthread.php/177936-draw-an-object-that-looks-the-same-size-regarles-the-distance-in-perspective-view
            this._vertBuilder.addVaryingLines('varying float scale;')
            this._vertBuilder.addMainFunctionLines(`
                float w = (projectionMatrix * viewMatrix * modelMatrix * vec4(0, 0, 0, 1)).w;
                w *= ${scaleFactor};
                scale = w;
                vPositionWorld = modelMatrix * vec4(w * position, 1);
            `);
            this._fragBuilder.addVaryingLines('varying float scale;');
            this._positionScaleFactor = scaleFactor;
        } else {
            this._vertBuilder.addMainFunctionLines(`
                vPositionWorld = modelMatrix * vec4(position, 1.0);
            `);
        }
        // gl_Position
        this._vertBuilder.addMainFunctionLines('gl_Position = projectionMatrix * viewMatrix * vPositionWorld;');

        this._fragBuilder.addVaryingLines('varying vec4 vPositionWorld;');

        return this;
    }

    addBillboardPosition() {
        //http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
        this._vertBuilder.addAttributeLines('attribute vec3 position;')
                         .addUniformLines('uniform mat4 modelMatrix;')
                         .addUniformLines('uniform mat4 viewMatrix;')
                         .addUniformLines('uniform mat4 projectionMatrix;')
                         .addUniformLines('uniform vec3 centerPosition;')
                         .addVaryingLines('varying vec4 vPositionWorld;')
                         .addMainFunctionLines(`
                             vec3 cameraRightWorld = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
                             vec3 cameraUpWorld = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
                             vPositionWorld = modelMatrix *
                                    vec4(centerPosition + cameraRightWorld * position.x + cameraUpWorld * position.y, 1.0);
                             gl_Position = projectionMatrix * viewMatrix * vPositionWorld;
                         `);

        this._fragBuilder.addVaryingLines('varying vec4 vPositionWorld;');

        this._billboardEnabled = true;
        return this;
    }

    // Requires add*Position() to be called first
    addNormal() {
        this._vertBuilder.addAttributeLines('attribute vec3 normal;')
                         .addUniformLines('uniform mat3 normalMatrix;')
                         .addVaryingLines('varying vec3 vNormalWorld;')
                         .addMainFunctionLines('vNormalWorld = normalMatrix * normal;');

        this._fragBuilder.addVaryingLines('varying vec3 vNormalWorld;');

        return this;
    }

    // Requires addPosition() to be called first with scaling applied
    addSphereClipping({sphereRadius}) {
        if (!sphereRadius) {
            throw new TypeError('No sphere radius specified');
        }
        if (!this._positionScaleFactor) {
            throw new Error('addPosition() needs to be called first with a scaling factor');
        }
        // Uses the "geometric solution" from
        // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
        this._fragBuilder.addUniformLines('uniform vec3 cameraPosition;')
                         .addUniformLines('uniform mat4 modelMatrix;')
                         .addFunction(`
                             bool shouldDiscard() {
                                 vec3 rayDir = normalize(vec3(vPositionWorld) - cameraPosition);
                                 vec3 sphereCenter = vec3(modelMatrix * vec4(0, 0, 0, 1));
                                 float radius2 = (float(${sphereRadius})*float(scale)) * (float(${sphereRadius})*float(scale));

                                 vec3 L = sphereCenter - cameraPosition;
                                 float tca = dot(L, rayDir);
                                 float d2 = dot(L, L) - tca * tca;
                                 if (d2 > radius2) {
                                     return false;
                                 }
                                 float thc = sqrt(radius2 - d2);
                                 float t0 = tca - thc;
                                 float t1 = tca + thc;

                                 if (t0 > t1) {
                                     float temp = t0;
                                     t0 = t1;
                                     t1 = temp;
                                 }
                                 if (t0 < 0.0) {
                                     t0 = t1;
                                     if (t0 < 0.0) {
                                         return false;
                                     }
                                 }

                                 if (t0 < length(vec3(vPositionWorld) - cameraPosition)) {
                                     return true;
                                 }
                                 return false;
                             }
                         `)
                         .addMainFunctionLines(`
                             if (shouldDiscard()) {
                                 discard;
                             }
                         `);
        return this;
    }
    // Requires addPosition() and addNormal() to be called first
    addSphereOutlining({epsilon}) {
        if (!epsilon) {
            throw new TypeError('Must specify an epsilon');
        }
        this._fragBuilder.addUniformLines('uniform vec3 cameraPosition;');
        this._fragBuilder.addMainFunctionLines(`
            vec3 cameraToObject = normalize(cameraPosition-vec3(vPositionWorld));
            if (dot(cameraToObject, vNormalWorld) > ${epsilon})  {
                discard;
            }
        `);
        return this;
    }

    // Requires add*Position() to be called first
    addTexcoord() {
        this._vertBuilder.addAttributeLines('attribute vec2 texcoord;')
                         .addVaryingLines('varying vec2 vTexcoord;')
                         .addMainFunctionLines('vTexcoord = texcoord;');

        this._fragBuilder.addUniformLines('uniform sampler2D texture;')
                         .addVaryingLines('varying vec2 vTexcoord;')
                         .addMainFunctionLines(`
                             vec4 texColor = texture2D(texture, vTexcoord);
                             if (texColor.a < 0.8) {
                                 discard;
                             }
                             fragColor += texColor;
                         `);

        return this;
    }

    // Requires addTexcoord() to be called first
    addColor() {
        this._fragBuilder.addUniformLines('uniform vec4 color;')
                         .addMainFunctionLines(`fragColor += color;`);

        return this;
    }

    // Requires add*Position() and addNormal() to be called first
    enableLighting() {
        this._fragBuilder.addUniformLines('uniform vec3 cameraPosition;');
        this._fragBuilder.addVariableLines(
            `
            vec3 materialAmbient = vec3(0.5, 0.5, 0.5);
            vec3 materialDiffuse = vec3(0.5, 0.5, 0.5);
            vec3 materialSpecular = vec3(0.8, 0.8, 0.8);
            `);
        this._fragBuilder.addFunction(
            `
            vec4 addPointLight(vec3 lightPositionWorld,
                    vec4 lightAmbient, vec4 lightDiffuse, vec4 lightSpecular, float specularTerm,
                    float constantAttenuation, float linearAttenuation, float quadraticAttenuation) {

                vec4 fragColor = vec4(0, 0, 0, 0);

                // Compute attenuation
                float distance = length(lightPositionWorld - vec3(vPositionWorld));
                float attenuation = 1.0 / (constantAttenuation +
                        linearAttenuation * distance + quadraticAttenuation * distance * distance);

                // Apply ambient lighting
                vec4 ambient = lightAmbient * vec4(materialAmbient, 1.0);
                fragColor += (attenuation * ambient);

                // Set up vectors for diffuse and specular calculations
                vec3 lightDirection = normalize(lightPositionWorld - vec3(vPositionWorld));
                vec3 lightReflect = reflect(-lightDirection, vNormalWorld);
                vec3 viewerDirection = normalize(cameraPosition - vec3(vPositionWorld));

                // Apply diffuse lighting
                vec4 diffuse = lightDiffuse * vec4(materialDiffuse, 1.0) * max(0.0, dot(vNormalWorld, lightDirection));
                fragColor += (attenuation * diffuse);

                // Apply specular lighting
                vec4 specular = lightSpecular * vec4(materialSpecular, 1.0) * pow(max(0.0, dot(viewerDirection, lightReflect)), specularTerm);
                fragColor += (attenuation * specular);

                return fragColor;
            }
            `
        );

        this._lightEnabled = true;
        return this;
    }

    /* Requires enableLighting() to be called first.
       Generates the uniforms:
           point${name}PositionWorld
           point${name}Ambient
           point${name}Diffuse
           point${name}Specular
           point${name}SpecularTerm
           point${name}ConstantAttenuation
           point${name}LinearAttenuation
           point${name}QuadraticAttenuation
    */
    addPointLight(name) {
        const varPrefix = `point${name}`;

        this._fragBuilder.addUniformLines(
            `
            uniform vec3 ${varPrefix}PositionWorld;
            uniform vec4 ${varPrefix}Ambient;
            uniform vec4 ${varPrefix}Diffuse;
            uniform vec4 ${varPrefix}Specular;
            uniform float ${varPrefix}SpecularTerm;
            uniform float ${varPrefix}ConstantAttenuation;
            uniform float ${varPrefix}LinearAttenuation;
            uniform float ${varPrefix}QuadraticAttenuation;
            `);
        this._fragBuilder.addMainFunctionLines(
            `fragColor += addPointLight(${varPrefix}PositionWorld,
                    ${varPrefix}Ambient, ${varPrefix}Diffuse, ${varPrefix}Specular, ${varPrefix}SpecularTerm,
                    ${varPrefix}ConstantAttenuation, ${varPrefix}LinearAttenuation, ${varPrefix}QuadraticAttenuation);`);

        return this;
    }

    build() {
        this._vertBuilder.setPrecisionLine('precision mediump float;');
        this._fragBuilder.setPrecisionLine('precision mediump float;');
        this._fragBuilder.addMainFunctionLines('gl_FragColor = fragColor;');

        const program = createProgram(this._vertBuilder.build(), this._fragBuilder.build());
        this._programData.program = program;

        this._programData.positionAttributeLocation = gl.getAttribLocation(program, 'position');
        this._programData.normalAttributeLocation = gl.getAttribLocation(program, 'normal');
        this._programData.texcoordAttributeLocation = gl.getAttribLocation(program, 'texcoord');

        this._programData.modelMatrixUniformLocation = gl.getUniformLocation(program, 'modelMatrix');
        this._programData.viewMatrixUniformLocation = gl.getUniformLocation(program, 'viewMatrix');
        this._programData.projectionMatrixUniformLocation = gl.getUniformLocation(program, 'projectionMatrix');
        this._programData.normalMatrixUniformLocation = gl.getUniformLocation(program, 'normalMatrix');
        this._programData.cameraPositionUniformLocation = gl.getUniformLocation(program, 'cameraPosition');
        this._programData.centerPositionUniformLocation = gl.getUniformLocation(program, 'centerPosition');
        this._programData.colorUniformLocation = gl.getUniformLocation(program, 'color');

        this._programData.lightEnabled = this._lightEnabled;
        this._programData.billboardEnabled = this._billboardEnabled;
        this._programData.positionScaleFactor = this._positionScaleFactor;

        return this._programData;
    }
}

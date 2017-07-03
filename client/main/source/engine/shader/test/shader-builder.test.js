import ShaderBuilder from '../shader-builder'
import {assert} from 'chai'

function compareShaders(shader1, shader2) {
    assert.equal(shader1.trim(), shader2.trim());
}

describe('Shader builder build', function() {

    let builder = null;

    beforeEach(function() {
        builder = new ShaderBuilder();
    });

    it('should succeed with no added data', function() {
        const shaderString = builder.build();

        compareShaders(shaderString,
            '\n' +
            'void main() {\n' +
            '}\n');
    });

    it('should accept a precision', function() {
        const shaderString = builder
                .setPrecisionLine('precision mediump float;')
                .build();

        compareShaders(shaderString,
            'precision mediump float;\n' +
            'void main() {\n' +
            '}\n');
    });

    it('should accept attributes, uniforms, varyings, variables, functions, and main function code', function() {
        const shaderString = builder
                .addAttributeLines('attribute vec3 position;')
                .addAttributeLines('attribute vec3 normal;')
                .addUniformLines('uniform mat4 modelMatrix;')
                .addVaryingLines('varying vec4 vPositionWorld;')
                .addVaryingLines('varying vec3 vNormalWorld;')
                .addVariableLines('float specularTerm = 100.0;')
                .addMainFunctionLines('vPositionWorld = modelMatrix * vec4(position, 1.0);')
                .addMainFunctionLines('vNormalWorld = normal;')
                .addFunction(
                    'float foobar(float baz) {\n' +
                    '    return baz;\n' +
                    '}')
                .build();

        compareShaders(shaderString,
            '\n' +
            'attribute vec3 position;\n' +
            'attribute vec3 normal;\n' +
            'uniform mat4 modelMatrix;\n' +
            'varying vec4 vPositionWorld;\n' +
            'varying vec3 vNormalWorld;\n' +
            'float specularTerm = 100.0;\n' +
            'float foobar(float baz) {\n' +
            '    return baz;\n' +
            '}\n' +
            'void main() {\n' +
            '\tvPositionWorld = modelMatrix * vec4(position, 1.0);\n' +
            '\tvNormalWorld = normal;\n' +
            '}\n');
    });

});

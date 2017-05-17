'use strict';

const ShaderBuilder = require('../../main/source/gl/shader-builder');
const assert = require('chai').assert;

describe('Shader builder build', function() {

    let builder = null;

    beforeEach(function() {
        builder = new ShaderBuilder();
    });

    it('should succeed with no added data', function() {
        const shaderString = builder.build();

        assert.equal(shaderString,
            '\n' +
            'void main() {\n' +
            '}\n');
    });

    it('should accept a precision', function() {
        const shaderString = builder
                .setPrecisionLine('precision mediump float;')
                .build();

        assert.equal(shaderString,
            'precision mediump float;\n' +
            'void main() {\n' +
            '}\n');
    });

    it('should accept attributes, uniforms, varyings, variables, and main function code', function() {
        const shaderString = builder
                .addAttributeLine('attribute vec3 position;')
                .addAttributeLine('attribute vec3 normal;')
                .addUniformLine('uniform mat4 modelMatrix;')
                .addVaryingLine('varying vec4 vPositionWorld;')
                .addVaryingLine('varying vec3 vNormalWorld;')
                .addVariableLine('float specularTerm = 100.0;')
                .addMainFunctionLine('vPositionWorld = modelMatrix * vec4(position, 1.0);')
                .addMainFunctionLine('vNormalWorld = normal;')
                .build();

        assert.equal(shaderString,
            '\n' +
            'attribute vec3 position;\n' +
            'attribute vec3 normal;\n' +
            'uniform mat4 modelMatrix;\n' +
            'varying vec4 vPositionWorld;\n' +
            'varying vec3 vNormalWorld;\n' +
            'float specularTerm = 100.0;\n' +
            'void main() {\n' +
            '\tvPositionWorld = modelMatrix * vec4(position, 1.0);\n' +
            '\tvNormalWorld = normal;\n' +
            '}\n');
    });

});

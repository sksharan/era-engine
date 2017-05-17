'use strict';

function ShaderBuilder() {
    this.precision = '';
    this.attributes = [];
    this.uniforms = [];
    this.varyings = [];
    this.variables = [];
    this.main = [];
}

ShaderBuilder.prototype.setPrecisionLine = function(precisionLine) {
    this.precision = precisionLine;
    return this;
}
ShaderBuilder.prototype.addAttributeLine = function(attributeLine) {
    this.attributes.push(attributeLine);
    return this;
}
ShaderBuilder.prototype.addUniformLine = function(uniformLine) {
    this.uniforms.push(uniformLine);
    return this;
}
ShaderBuilder.prototype.addVaryingLine = function(varyingLine) {
    this.varyings.push(varyingLine);
    return this;
}
ShaderBuilder.prototype.addVariableLine = function(variableLine) {
    this.variables.push(variableLine);
    return this;
}
ShaderBuilder.prototype.addMainFunctionLine = function(mainFunctionLine) {
    this.main.push(mainFunctionLine);
    return this;
}

ShaderBuilder.prototype.build = function() {
    let shaderString = '';

    shaderString += this.precision + '\n';

    for (let i = 0; i < this.attributes.length; i++) {
        shaderString += this.attributes[i] + '\n';
    }
    for (let i = 0; i < this.uniforms.length; i++) {
        shaderString += this.uniforms[i] + '\n';
    }
    for (let i = 0; i < this.varyings.length; i++) {
        shaderString += this.varyings[i] + '\n';
    }
    for (let i = 0; i < this.variables.length; i++) {
        shaderString += this.variables[i] + '\n';
    }

    shaderString += 'void main() {\n'
    for (let i = 0; i < this.main.length; i++) {
        shaderString += '\t' + this.main[i] + '\n';
    }
    shaderString += '}\n';

    return shaderString;
}

module.exports = ShaderBuilder;

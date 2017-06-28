export default class ShaderBuilder {
    constructor() {
        this._precision = '';
        this._attributes = [];
        this._uniforms = [];
        this._varyings = [];
        this._variables = [];
        this._main = [];
    }

    setPrecisionLine(precisionLine) {
        this._precision = precisionLine;
        return this;
    }
    addAttributeLine(attributeLine) {
        this._attributes.push(attributeLine);
        return this;
    }
    addUniformLine(uniformLine) {
        this._uniforms.push(uniformLine);
        return this;
    }
    addVaryingLine(varyingLine) {
        this._varyings.push(varyingLine);
        return this;
    }
    addVariableLine(variableLine) {
        this._variables.push(variableLine);
        return this;
    }
    addMainFunctionLine(mainFunctionLine) {
        this._main.push(mainFunctionLine);
        return this;
    }

    build() {
        let shaderString = '';

        shaderString += this._precision + '\n';

        for (let i = 0; i < this._attributes.length; i++) {
            shaderString += this._attributes[i] + '\n';
        }
        for (let i = 0; i < this._uniforms.length; i++) {
            shaderString += this._uniforms[i] + '\n';
        }
        for (let i = 0; i < this._varyings.length; i++) {
            shaderString += this._varyings[i] + '\n';
        }
        for (let i = 0; i < this._variables.length; i++) {
            shaderString += this._variables[i] + '\n';
        }

        shaderString += 'void main() {\n'
        for (let i = 0; i < this._main.length; i++) {
            shaderString += '\t' + this._main[i] + '\n';
        }
        shaderString += '}\n';

        return shaderString;
    }
}

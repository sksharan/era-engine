export default class ShaderBuilder {
    constructor() {
        this._precision = '';
        this._attributes = [];
        this._uniforms = [];
        this._varyings = [];
        this._variables = [];
        this._main = [];
        this._functions = [];
    }

    setPrecisionLine(line) {
        this._precision = line;
        return this;
    }
    addAttributeLines(lines) {
        this._attributes.push(lines);
        return this;
    }
    addUniformLines(lines) {
        this._uniforms.push(lines);
        return this;
    }
    addVaryingLines(lines) {
        this._varyings.push(lines);
        return this;
    }
    addVariableLines(lines) {
        this._variables.push(lines);
        return this;
    }
    addMainFunctionLines(lines) {
        this._main.push(lines);
        return this;
    }
    addFunction(func) {
        this._functions.push(func);
        return this;
    }

    build() {
        let shaderString = `${this._precision}\n`;

        for (let attr of this._attributes) {
            shaderString += `${attr}\n`;
        }
        for (let uniform of this._uniforms) {
            shaderString += `${uniform}\n`;
        }
        for (let varying of this._varyings) {
            shaderString += `${varying}\n`;
        }
        for (let variable of this._variables) {
            shaderString += `${variable}\n`;
        }

        for (let func of this._functions) {
            shaderString += `${func}\n`;
        }

        shaderString += 'void main() {\n';
        for (let data of this._main) {
            shaderString += `\t${data}\n`;
        }
        shaderString += '}\n';

        return shaderString;
    }
}

export default class ShaderBuilder {
    constructor() {
        this.precision = '';
        this.attributes = [];
        this.uniforms = [];
        this.varyings = [];
        this.variables = [];
        this.main = [];
    }

    setPrecisionLine(precisionLine) {
        this.precision = precisionLine;
        return this;
    }
    addAttributeLine(attributeLine) {
        this.attributes.push(attributeLine);
        return this;
    }
    addUniformLine(uniformLine) {
        this.uniforms.push(uniformLine);
        return this;
    }
    addVaryingLine(varyingLine) {
        this.varyings.push(varyingLine);
        return this;
    }
    addVariableLine(variableLine) {
        this.variables.push(variableLine);
        return this;
    }
    addMainFunctionLine(mainFunctionLine) {
        this.main.push(mainFunctionLine);
        return this;
    }

    build() {
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
}
